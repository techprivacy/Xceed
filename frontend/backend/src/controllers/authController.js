const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ASSIGNABLE_ROLES } = require('../config/permissions');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// @route POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/auth/me
exports.me = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// @route GET /api/auth/users (admin) - for assigning sales executives etc.
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ username: 1 });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route POST /api/auth/users (admin only, enforced in routes) - create a
// staff account with a fixed role. 'admin' is deliberately not in
// ASSIGNABLE_ROLES — granting full superuser access happens by hand in the
// database, not through this form, so a compromised admin session can't mint
// more admins through the UI.
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }
    if (role && !ASSIGNABLE_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Role must be one of: ${ASSIGNABLE_ROLES.join(', ')}`,
      });
    }

    const user = await User.create({ username, email, password, role: role || ASSIGNABLE_ROLES[0] });
    res.status(201).json({
      success: true,
      data: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'That username is already taken' });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

// @route PUT /api/auth/users/:id (admin only) - edit a user's role/email.
// Username and password are not editable here — mirrors updateMember's
// findByIdAndUpdate choice: it bypasses the password-hashing pre-save hook,
// so accepting a password on this path would store it in plain text.
exports.updateUser = async (req, res) => {
  try {
    const { role, email } = req.body;
    if (role && role !== 'admin' && !ASSIGNABLE_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Role must be one of: ${ASSIGNABLE_ROLES.join(', ')}`,
      });
    }
    if (role === 'admin' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only an admin can grant admin access' });
    }

    const updates = {};
    if (role) updates.role = role;
    if (email !== undefined) updates.email = email;

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @route DELETE /api/auth/users/:id (admin only)
exports.deleteUser = async (req, res) => {
  try {
    if (String(req.params.id) === String(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
