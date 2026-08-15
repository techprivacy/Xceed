const express = require('express');
const router = express.Router();
const {
  submitApplication,
  getMyApplication,
  getPublicDirectory,
  getApplications,
  getApplicationStats,
  getApplicationById,
  updateApplication,
  approveApplication,
  rejectApplication,
  deleteApplication,
} = require('../controllers/membershipController');
const { protect } = require('../middlewares/auth');
const { requirePermission } = require('../middlewares/permissions');
const { protectAccount } = require('../middlewares/accountAuth');

// Public
router.get('/directory', getPublicDirectory);

// Account-authenticated — must come before /:id so "mine" isn't parsed as
// an id, same reasoning as memberRoutes.js's /me ordering.
router.post('/', protectAccount, submitApplication);
router.get('/mine', protectAccount, getMyApplication);

// Admin-authenticated
router.get('/stats', protect, requirePermission('directory'), getApplicationStats);
router.get('/', protect, requirePermission('directory'), getApplications);
router.get('/:id', protect, requirePermission('directory'), getApplicationById);
router.put('/:id', protect, requirePermission('directory'), updateApplication);
router.put('/:id/approve', protect, requirePermission('directory'), approveApplication);
router.put('/:id/reject', protect, requirePermission('directory'), rejectApplication);
router.delete('/:id', protect, requirePermission('directory'), deleteApplication);

module.exports = router;
