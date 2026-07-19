const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String },
    shortDescription: { type: String },
    images: [{ type: String }],

    // Pricing
    price: { type: Number, required: true },
    priceUnit: { type: String, enum: ['per_letter', 'per_piece', 'per_set'], default: 'per_piece' },
    currency: { type: String, default: 'INR' },

    // Variants e.g. size (5mm/6mm/7mm/8mm), letter style (concave/convex)
    variants: [
      {
        label: { type: String }, // e.g. "6 mm"
        priceOverride: { type: Number },
      },
    ],

    minOrderQty: { type: Number, default: 1 },
    inStock: { type: Boolean, default: true },
    isBestSeller: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
