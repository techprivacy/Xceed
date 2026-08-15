const mongoose = require('mongoose');

// Mirrors Member.js's old business-detail fields exactly (this replaces
// what Member used to do), minus email/password — identity now lives on
// the Account this application belongs to, not duplicated here.
const MEMBERSHIP_TYPES = [
  'Indian Company',
  'Japanese Company',
  'Foundry / Manufacturer',
  'Technology / Machinery Supplier',
  'Industry Professional',
];

const membershipApplicationSchema = new mongoose.Schema(
  {
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true, index: true },

    companyName: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    industry: { type: String, trim: true },
    products: { type: String, trim: true },
    location: { type: String, trim: true },
    country: { type: String, trim: true },
    website: { type: String, trim: true },
    membershipType: { type: String, trim: true, enum: [...MEMBERSHIP_TYPES, ''] },
    companyLogo: { type: String },
    mobileNumber: { type: String, trim: true },
    whatsappNumber: { type: String, trim: true },
    officeAddress: { type: String, trim: true },

    // One application at a time per account — resubmitting after a
    // rejection reuses the same document rather than piling up duplicates
    // (see membershipController.submitApplication).
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    subscriptionStatus: { type: String, enum: ['none', 'active', 'expired'], default: 'none' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MembershipApplication', membershipApplicationSchema);
