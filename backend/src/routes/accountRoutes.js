const express = require('express');
const router = express.Router();
const {
  registerAccount,
  verifyEmail,
  resendVerification,
  loginAccount,
  forgotPassword,
  resetPassword,
  getMyProfile,
  updateMyProfile,
  getAccounts,
} = require('../controllers/accountController');
const { protect } = require('../middlewares/auth');
const { requirePermission } = require('../middlewares/permissions');
const { protectAccount } = require('../middlewares/accountAuth');

// Public
router.post('/register', registerAccount);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/login', loginAccount);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Account-authenticated
router.get('/me', protectAccount, getMyProfile);
router.put('/me', protectAccount, updateMyProfile);

// Admin-authenticated — reuses the existing 'directory' permission rather
// than introducing a new one, same as membershipApplicationRoutes.js.
router.get('/', protect, requirePermission('directory'), getAccounts);

module.exports = router;
