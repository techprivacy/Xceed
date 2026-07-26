const jwt = require('jsonwebtoken');
const Member = require('../models/Member');

const issueToken = (id) =>
  jwt.sign({ id, kind: 'member' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// Fields a member (or a public applicant) is allowed to set on their own
// record. Deliberately excludes status and subscriptionStatus, which only an
// admin can change — see updateMember below.
const SELF_EDITABLE_FIELDS = [
  'companyName',
  'contactPerson',
  'industry',
  'products',
  'location',
  'companyLogo',
  'mobileNumber',
  'whatsappNumber',
  'officeAddress',
];

const pick = (source, fields) =>
  fields.reduce((acc, key) => {
    if (source[key] !== undefined) acc[key] = source[key];
    return acc;
  }, {});

// --- Public ---

// @route POST /api/members/register
exports.registerMember = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    const { companyName, contactPerson } = req.body;
    if (!companyName || !contactPerson) {
      return res.status(400).json({ success: false, message: 'Company name and contact person are required' });
    }

    const member = await Member.create({
      ...pick(req.body, SELF_EDITABLE_FIELDS),
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: 'Application received. Our team will review it and confirm your membership shortly.',
      data: { id: member._id, status: member.status },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'An application with this email already exists' });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

// @route POST /api/members/login
exports.loginMember = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const member = await Member.findOne({ email: email.trim().toLowerCase() });
    if (!member || !(await member.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (member.status === 'pending') {
      return res.status(403).json({
        success: false,
        message: 'Your membership application is still pending approval.',
      });
    }
    if (member.status === 'rejected') {
      return res.status(403).json({
        success: false,
        message: 'Your membership application was not approved. Contact us for details.',
      });
    }

    const token = issueToken(member._id);
    res.json({
      success: true,
      token,
      member: { id: member._id, companyName: member.companyName, email: member.email },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/members/directory (public)
// Approved members only, and only the fields the public directory card shows
// — email is intentionally withheld here even though it's on the model.
exports.getPublicDirectory = async (req, res) => {
  try {
    const members = await Member.find({ status: 'approved' })
      .select('companyName contactPerson industry products location companyLogo')
      .sort({ companyName: 1 });
    res.json({ success: true, count: members.length, data: members });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- Member-authenticated (protectMember) ---

// @route GET /api/members/me
exports.getMyProfile = async (req, res) => {
  res.json({ success: true, data: req.member });
};

// @route PUT /api/members/me
exports.updateMyProfile = async (req, res) => {
  try {
    const updates = pick(req.body, SELF_EDITABLE_FIELDS);
    const member = await Member.findByIdAndUpdate(req.member._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');
    res.json({ success: true, data: member });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// --- Admin-authenticated (protect + requirePermission('directory')) ---

// @route GET /api/members (admin)
exports.getMembers = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [members, total] = await Promise.all([
      Member.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Member.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: members.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: members,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/members/stats (admin) — dashboard tiles
exports.getMemberStats = async (req, res) => {
  try {
    const [totalMembers, approvedMembers, pendingApprovals] = await Promise.all([
      Member.countDocuments({ status: { $ne: 'rejected' } }),
      Member.countDocuments({ status: 'approved' }),
      Member.countDocuments({ status: 'pending' }),
    ]);
    res.json({ success: true, data: { totalMembers, approvedMembers, pendingApprovals } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/members/:id (admin)
exports.getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).select('-password');
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, data: member });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @route PUT /api/members/:id (admin) — edit any member's profile, status or
// subscription. Password is deliberately never accepted through this path:
// findByIdAndUpdate skips the model's pre('save') hashing hook, so a password
// here would be stored in plain text. Members change their own password
// through their own profile, not via admin edit.
exports.updateMember = async (req, res) => {
  try {
    const { password, ...body } = req.body;
    const updates = pick(body, [...SELF_EDITABLE_FIELDS, 'status', 'subscriptionStatus']);
    const member = await Member.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, data: member });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @route PUT /api/members/:id/approve (admin)
exports.approveMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    ).select('-password');
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, data: member });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @route PUT /api/members/:id/reject (admin)
exports.rejectMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    ).select('-password');
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, data: member });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @route DELETE /api/members/:id (admin)
exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, message: 'Member deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
