const { ROLE_PERMISSIONS } = require('../config/permissions');

// Use after `protect`. 'admin' always passes; other roles need the named
// permission in config/permissions.js's ROLE_PERMISSIONS map.
const requirePermission = (permission) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
  if (req.user.role === 'admin') return next();

  const allowed = ROLE_PERMISSIONS[req.user.role] || [];
  if (allowed.includes(permission)) return next();

  return res.status(403).json({
    success: false,
    message: `Your role does not have "${permission}" access`,
  });
};

module.exports = { requirePermission };
