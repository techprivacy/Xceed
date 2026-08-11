const SavedCart = require('../models/SavedCart');

// @route POST /api/saved-carts (public - "Save Cart" popup)
exports.createSavedCart = async (req, res) => {
  try {
    const { items, grandTotal, name, email, mobileNumber } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }
    if (!name || !email || !mobileNumber) {
      return res.status(400).json({ success: false, message: 'Name, email and mobile number are required' });
    }

    const savedCart = await SavedCart.create({ items, grandTotal, name, email, mobileNumber });
    res.status(201).json({ success: true, message: 'Cart saved successfully', data: savedCart });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @route GET /api/saved-carts (admin)
exports.getSavedCarts = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [savedCarts, total] = await Promise.all([
      SavedCart.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      SavedCart.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: savedCarts.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: savedCarts,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route PUT /api/saved-carts/:id (admin) - status updates
exports.updateSavedCart = async (req, res) => {
  try {
    const { status } = req.body;
    const savedCart = await SavedCart.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!savedCart) return res.status(404).json({ success: false, message: 'Saved cart not found' });
    res.json({ success: true, data: savedCart });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @route DELETE /api/saved-carts/:id (admin)
exports.deleteSavedCart = async (req, res) => {
  try {
    const savedCart = await SavedCart.findByIdAndDelete(req.params.id);
    if (!savedCart) return res.status(404).json({ success: false, message: 'Saved cart not found' });
    res.json({ success: true, message: 'Saved cart deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
