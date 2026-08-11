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

    // Drives which interactive builder renders on this product's category page
    // (Cast Letters / Cast Numbers / Holders) instead of a plain product grid.
    configuratorType: {
      type: String,
      enum: ['none', 'cast_letters', 'cast_numbers', 'holder'],
      default: 'none',
    },

    // Per-size pricing for cast_letters / cast_numbers / holder configurators
    sizePricing: [
      {
        size: { type: String }, // e.g. "5mm"
        price: { type: Number },
      },
    ],

    // Holder price matrix, holder configurator only: { [size]: { GLUE|SCREW: { [capacity]: price } } }
    holderPriceMatrix: { type: mongoose.Schema.Types.Mixed },

    minOrderQty: { type: Number, default: 1 },
    inStock: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    isBestSeller: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
