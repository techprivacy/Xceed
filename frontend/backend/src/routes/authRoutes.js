const express = require('express');
const router = express.Router();
const { login, me, getUsers, createUser, updateUser, deleteUser } = require('../controllers/authController');
const { protect, adminOnly } = require('../middlewares/auth');

router.post('/login', login);
router.get('/me', protect, me);
// User & role management stays on the original adminOnly gate, never
// requirePermission — see config/permissions.js for why this is never
// delegable to a custom role.
router.get('/users', protect, adminOnly, getUsers);
router.post('/users', protect, adminOnly, createUser);
router.put('/users/:id', protect, adminOnly, updateUser);
router.delete('/users/:id', protect, adminOnly, deleteUser);

module.exports = router;
