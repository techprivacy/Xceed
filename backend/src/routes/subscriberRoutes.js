const express = require('express');
const router = express.Router();
const { createSubscriber, getSubscribers, deleteSubscriber } = require('../controllers/subscriberController');
const { protect, adminOnly } = require('../middlewares/auth');

router.post('/', createSubscriber);
router.get('/', protect, adminOnly, getSubscribers);
router.delete('/:id', protect, adminOnly, deleteSubscriber);

module.exports = router;
