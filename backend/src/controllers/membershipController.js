const MembershipApplication = require('../models/MembershipApplication');

const SELF_EDITABLE_FIELDS = [
  'companyName',
  'contactPerson',
  'industry',
  'products',
  'location',
  'country',
  'website',
  'membershipType',
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

// --- Account-authenticated ---

// @route POST /api/membership-applications
// Step 2 of "User Account -> Apply for Membership -> ... -> Admin Review":
// requires an already-signed-in, already-verified Account (see
// middlewares/accountAuth.js on the route) — this step no longer creates
// any login credentials of its own, it's purely a business application tied
// to req.account. Resubmitting (e.g. after a rejection) reuses the same
// document and resets it to pending, rather than accumulating duplicates.
exports.submitApplication = async (req, res) => {
  try {
    const { companyName, contactPerson } = req.body;
    if (!companyName || !contactPerson) {
      return res.status(400).json({ success: false, message: 'Company name and contact person are required' });
    }

    let application = await MembershipApplication.findOne({ account: req.account._id });
    if (application) {
      Object.assign(application, pick(req.body, SELF_EDITABLE_FIELDS));
      application.status = 'pending';
      await application.save();
    } else {
      application = await MembershipApplication.create({
        ...pick(req.body, SELF_EDITABLE_FIELDS),
        account: req.account._id,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Application received. Our team will review it and confirm your membership shortly.',
      data: { id: application._id, status: application.status },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @route GET /api/membership-applications/mine
exports.getMyApplication = async (req, res) => {
  try {
    const application = await MembershipApplication.findOne({ account: req.account._id });
    res.json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- Public ---

// @route GET /api/membership-applications/directory
// Only approved applications — mirrors the old Member directory's
// approved-only visibility exactly.
exports.getPublicDirectory = async (req, res) => {
  try {
    const applications = await MembershipApplication.find({ status: 'approved' })
      .select('companyName contactPerson industry products location companyLogo')
      .sort({ companyName: 1 });
    res.json({ success: true, count: applications.length, data: applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- Admin ---

// @route GET /api/membership-applications (admin)
exports.getApplications = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
      ];
    }
    const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.max(1, parseInt(limit, 10));
    const [applications, total] = await Promise.all([
      MembershipApplication.find(query)
        .populate('account', 'fullName email emailVerified')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Math.max(1, parseInt(limit, 10))),
      MembershipApplication.countDocuments(query),
    ]);
    res.json({
      success: true,
      data: applications,
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/membership-applications/stats (admin) — dashboard tiles
exports.getApplicationStats = async (req, res) => {
  try {
    const [approvedCompanies, pendingApplications, totalApplications] = await Promise.all([
      MembershipApplication.countDocuments({ status: 'approved' }),
      MembershipApplication.countDocuments({ status: 'pending' }),
      MembershipApplication.countDocuments(),
    ]);
    res.json({ success: true, data: { approvedCompanies, pendingApplications, totalApplications } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/membership-applications/:id (admin)
exports.getApplicationById = async (req, res) => {
  try {
    const application = await MembershipApplication.findById(req.params.id).populate(
      'account',
      'fullName email emailVerified'
    );
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route PUT /api/membership-applications/:id (admin) — edit any
// application's details/status/subscription directly.
exports.updateApplication = async (req, res) => {
  try {
    const application = await MembershipApplication.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, data: application });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @route PUT /api/membership-applications/:id/approve (admin)
// No credentials to generate/email here, unlike the old Member.approveMember
// — the applicant already has a working Account login from step 1. This
// purely flips the application's own status.
exports.approveApplication = async (req, res) => {
  try {
    const application = await MembershipApplication.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, data: application });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @route PUT /api/membership-applications/:id/reject (admin)
exports.rejectApplication = async (req, res) => {
  try {
    const application = await MembershipApplication.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, data: application });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @route DELETE /api/membership-applications/:id (admin)
exports.deleteApplication = async (req, res) => {
  try {
    const application = await MembershipApplication.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
