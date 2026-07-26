const jwt = require('jsonwebtoken');
const Member = require('../models/Member');

// Deliberately separate from middlewares/auth.js's `protect`, even though both
// verify a JWT signed with the same JWT_SECRET. Two things keep the two token
// types from being interchangeable:
//   1. Members live in their own collection, so a member id decoded by the
//      admin `protect` middleware's `User.findById` simply finds nothing.
//   2. Defense in depth: the token payload itself carries `kind: 'member'`
//      (see controllers/memberController.js issueToken), and this middleware
//      rejects any token missing that claim before it ever queries Mongo.
const protectMember = async (req, res, next) => {
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
    if (decoded.kind !== 'member') {
      return res.status(401).json({ success: false, message: 'Not authorized for member access' });
    }
    req.member = await Member.findById(decoded.id).select('-password');
    if (!req.member) {
      return res.status(401).json({ success: false, message: 'Member no longer exists' });
    }
    if (req.member.status !== 'approved') {
      return res.status(403).json({ success: false, message: 'Membership is not active' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
  }
};

module.exports = { protectMember };
