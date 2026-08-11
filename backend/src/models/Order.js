const mongoose = require('mongoose');

// Snapshot of a cart line at checkout time — deliberately not a ref to Product,
// since configurator lines (cast letters/numbers/holders) aren't Product
// documents at all and prices must stay frozen even if the catalogue changes later.
const orderItemSchema = new mongoose.Schema(
  {
    kind: { type: String, enum: ['letters', 'numbers', 'holder', 'product'], required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    total: { type: Number, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    image: { type: String },
    details: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    items: { type: [orderItemSchema], required: true, validate: (v) => v.length > 0 },
    subtotal: { type: Number, required: true },
    gstTotal: { type: Number, required: true, default: 0 },
    grandTotal: { type: Number, required: true },

    customerName: { type: String, required: true, trim: true },
    companyName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    mobileNumber: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    notes: { type: String, trim: true },

    status: {
      type: String,
      enum: ['new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'new',
    },
    source: { type: String, default: 'website' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
