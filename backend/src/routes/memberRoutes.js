const express = require('express');
const router = express.Router();
const {
  registerMember,
  loginMember,
  forgotPassword,
  getPublicDirectory,
  getMyProfile,
  updateMyProfile,
  getMembers,
  getMemberStats,
  getMemberById,
  updateMember,
  approveMember,
  rejectMember,
  deleteMember,
} = require('../controllers/memberController');
const { protect } = require('../middlewares/auth');
const { requirePermission } = require('../middlewares/permissions');
const { protectMember } = require('../middlewares/memberAuth');

// Public
router.post('/register', registerMember);
router.post('/login', loginMember);
router.post('/forgot-password', forgotPassword);
router.get('/directory', getPublicDirectory);

// Member-authenticated — must come before /:id so "me" isn't parsed as an id
router.get('/me', protectMember, getMyProfile);
router.put('/me', protectMember, updateMyProfile);

// Admin-authenticated
router.get('/stats', protect, requirePermission('directory'), getMemberStats);
router.get('/', protect, requirePermission('directory'), getMembers);
router.get('/:id', protect, requirePermission('directory'), getMemberById);
router.put('/:id', protect, requirePermission('directory'), updateMember);
router.put('/:id/approve', protect, requirePermission('directory'), approveMember);
router.put('/:id/reject', protect, requirePermission('directory'), rejectMember);
router.delete('/:id', protect, requirePermission('directory'), deleteMember);

module.exports = router;
