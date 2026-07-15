const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const quoteRequestSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    gstNumber: { type: String, trim: true },
    industry: { type: String, trim: true },
    contactPerson: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    mobileNumber: { type: String, required: true, trim: true },
    city: { type: String },
    state: { type: String },
    productRequirement: { type: String, required: true },
    quantity: { type: String },
    specialRequirement: { type: String },
    drawingUrl: { type: String },
    salesExecutive: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['new', 'follow_up', 'negotiation', 'quotation_sent', 'won', 'lost'],
      default: 'new',
    },
    internalNotes: [noteSchema],
    source: { type: String, default: 'website' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('QuoteRequest', quoteRequestSchema);
