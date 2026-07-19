const express = require('express');
const router = express.Router();
const { getLiveTheme, getDraftTheme, updateDraftTheme, publishTheme } = require('../controllers/themeController');
const { protect, adminOnly } = require('../middlewares/auth');

router.get('/', getLiveTheme);
router.get('/draft', protect, adminOnly, getDraftTheme);
router.put('/draft', protect, adminOnly, updateDraftTheme);
router.post('/publish', protect, adminOnly, publishTheme);

module.exports = router;
