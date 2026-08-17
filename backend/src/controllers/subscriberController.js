const Subscriber = require('../models/Subscriber');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// @route POST /api/subscribers  (public - newsletter signup in footer)
exports.createSubscriber = async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();

    if (!email || !EMAIL_RE.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
    }

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(200).json({ success: true, message: "You're already subscribed!", data: existing });
    }

    const subscriber = await Subscriber.create({ email, source: req.body.source || 'Footer' });
    res.status(201).json({ success: true, message: 'Subscribed successfully!', data: subscriber });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

// @route GET /api/subscribers  (admin only)
exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json({ success: true, data: subscribers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

// @route DELETE /api/subscribers/:id  (admin only)
exports.deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ success: false, message: 'Subscriber not found' });
    }
    res.json({ success: true, message: 'Subscriber removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};
