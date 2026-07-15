const express = require('express');
const router = express.Router();
const { login, me, getUsers } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', protect, me);
router.get('/users', protect, adminOnly, getUsers);

module.exports = router;
