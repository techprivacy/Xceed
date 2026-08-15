const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Account = require('../models/Account');
const { getTransporter, isConfigured } = require('../config/mailer');

const issueToken = (id) =>
  jwt.sign({ id, kind: 'account' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// Tokens are emailed raw but stored hashed (same approach for both email
// verification and password reset) — a leaked database dump doesn't hand
// out live links this way, same reasoning as never storing plaintext
// passwords.
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const clientUrl = () => process.env.CLIENT_URL || 'http://localhost:3000';

// @route POST /api/accounts/register
// Self-service, no admin involved — this is the entire point of Account
// vs. the old approval-gated Member flow (see MembershipApplication for
// where admin review still happens, as a separate later step). Created
// unverified; login is blocked until the emailed link is used.
exports.registerAccount = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Full name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const account = new Account({ fullName, email, password });
    const rawToken = crypto.randomBytes(32).toString('hex');
    account.emailVerificationTokenHash = hashToken(rawToken);
    account.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24h
    await account.save();

    let emailStatus = 'not_configured';
    if (isConfigured()) {
      try {
        const transporter = getTransporter();
        const verifyUrl = `${clientUrl()}/verify-email?token=${rawToken}`;
        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: account.email,
          subject: 'Verify your XCEED account',
          text: `Hi ${fullName},\n\nWelcome to XCEED. Verify your email to activate your account:\n\n${verifyUrl}\n\nThis link expires in 24 hours.\n\nIf you didn't create this account, you can ignore this email.\n\nRegards,\nXCEED Team`,
        });
        emailStatus = 'sent';
      } catch (err) {
        emailStatus = 'failed';
      }
    }

    res.status(201).json({
      success: true,
      message: 'Account created. Check your email to verify and activate it.',
      emailStatus,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

// @route POST /api/accounts/verify-email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: 'Token is required' });

    const account = await Account.findOne({
      emailVerificationTokenHash: hashToken(token),
      emailVerificationExpires: { $gt: Date.now() },
    });
    if (!account) {
      return res.status(400).json({ success: false, message: 'This verification link is invalid or has expired.' });
    }

    account.emailVerified = true;
    account.emailVerificationTokenHash = undefined;
    account.emailVerificationExpires = undefined;
    await account.save();

    res.json({ success: true, message: 'Email verified — you can now sign in.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route POST /api/accounts/resend-verification
// Generic response either way (registered-and-unverified vs. not) so this
// can't be used to enumerate registered emails — same pattern as
// forgotPassword below.
exports.resendVerification = async (req, res) => {
  const GENERIC = 'If that email is registered and not yet verified, a new link has been sent.';
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const account = await Account.findOne({ email: email.trim().toLowerCase() });
    if (!account || account.emailVerified || !isConfigured()) {
      return res.json({ success: true, message: GENERIC });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    account.emailVerificationTokenHash = hashToken(rawToken);
    account.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await account.save();

    try {
      const transporter = getTransporter();
      const verifyUrl = `${clientUrl()}/verify-email?token=${rawToken}`;
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: account.email,
        subject: 'Verify your XCEED account',
        text: `Hi ${account.fullName},\n\nHere's your new verification link:\n\n${verifyUrl}\n\nThis link expires in 24 hours.\n\nRegards,\nXCEED Team`,
      });
    } catch (err) {
      // Response stays generic regardless.
    }

    res.json({ success: true, message: GENERIC });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route POST /api/accounts/login
exports.loginAccount = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const account = await Account.findOne({ email: email.trim().toLowerCase() });
    if (!account || !(await account.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    if (!account.emailVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before signing in — check your inbox for the verification link.',
      });
    }

    const token = issueToken(account._id);
    res.json({
      success: true,
      token,
      account: { id: account._id, fullName: account.fullName, email: account.email },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route POST /api/accounts/forgot-password
// Generic response either way, and the reset link only works once a new
// password is actually submitted through it — no password changes here
// itself, so a mail failure can't lock anyone out (mirrors the reasoning
// in the old Member forgotPassword this replaces).
exports.forgotPassword = async (req, res) => {
  const GENERIC = 'If that email is registered, a reset link has been sent.';
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const account = await Account.findOne({ email: email.trim().toLowerCase() });
    if (!account || !isConfigured()) {
      return res.json({ success: true, message: GENERIC });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    account.passwordResetTokenHash = hashToken(rawToken);
    account.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1h
    await account.save();

    try {
      const transporter = getTransporter();
      const resetUrl = `${clientUrl()}/reset-password?token=${rawToken}`;
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: account.email,
        subject: 'Reset your XCEED password',
        text: `Hi ${account.fullName},\n\nReset your password here (expires in 1 hour):\n\n${resetUrl}\n\nIf you didn't request this, you can ignore this email — your password hasn't changed.\n\nRegards,\nXCEED Team`,
      });
    } catch (err) {
      // Response stays generic regardless.
    }

    res.json({ success: true, message: GENERIC });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route POST /api/accounts/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token and new password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const account = await Account.findOne({
      passwordResetTokenHash: hashToken(token),
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!account) {
      return res.status(400).json({ success: false, message: 'This reset link is invalid or has expired.' });
    }

    account.password = password; // pre('save') hook hashes this
    account.passwordResetTokenHash = undefined;
    account.passwordResetExpires = undefined;
    await account.save();

    res.json({ success: true, message: 'Password updated — you can now sign in.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/accounts/me
exports.getMyProfile = async (req, res) => {
  res.json({ success: true, data: req.account });
};

// @route PUT /api/accounts/me
exports.updateMyProfile = async (req, res) => {
  try {
    const account = await Account.findById(req.account._id);
    if (req.body.fullName) account.fullName = req.body.fullName;
    await account.save();
    const data = account.toObject();
    delete data.password;
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// --- Admin ---

// @route GET /api/accounts (admin) — the "Users" list: directly registered
// accounts, no approval concept at all (contrast with GET
// /api/membership-applications, which is approval-gated).
exports.getAccounts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const [accounts, total] = await Promise.all([
      Account.find()
        .select('-password -emailVerificationTokenHash -passwordResetTokenHash')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Account.countDocuments(),
    ]);
    res.json({ success: true, data: accounts, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
