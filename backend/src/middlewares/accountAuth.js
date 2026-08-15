const jwt = require('jsonwebtoken');
const Account = require('../models/Account');

// Deliberately separate from middlewares/auth.js (admin) and memberAuth.js
// (the old, being-phased-out Member login) — same pattern as both: a
// distinct `kind` claim in the JWT payload (see accountController.
// issueToken) plus a distinct collection, so tokens from one system can't
// be replayed against another even though all three share JWT_SECRET.
const protectAccount = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.kind !== 'account') {
      return res.status(401).json({ success: false, message: 'Not authorized for account access' });
    }
    req.account = await Account.findById(decoded.id).select('-password');
    if (!req.account) {
      return res.status(401).json({ success: false, message: 'Account no longer exists' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
  }
};

module.exports = { protectAccount };
