const mongoose = require('mongoose');

const savedCartItemSchema = new mongoose.Schema(
  {
    kind: { type: String, enum: ['letters', 'numbers', 'holder', 'product'], required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    total: { type: Number, required: true },
    image: { type: String },
    details: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false }
);

// A cart a visitor asked us to hang on to instead of checking out immediately —
// captures just enough contact info for sales to follow up, not a full order.
const savedCartSchema = new mongoose.Schema(
  {
    items: { type: [savedCartItemSchema], required: true, validate: (v) => v.length > 0 },
    grandTotal: { type: Number, required: true },

    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    mobileNumber: { type: String, required: true, trim: true },

    status: { type: String, enum: ['new', 'contacted', 'converted'], default: 'new' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SavedCart', savedCartSchema);
