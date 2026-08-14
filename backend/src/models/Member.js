const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// A Member is a distinct principal from User (admin/staff) — separate
// collection, separate JWT "kind" claim, separate auth middleware — so a
// member token can never be replayed against an admin route or vice versa
// (see middlewares/memberAuth.js).
const MEMBERSHIP_TYPES = [
  'Indian Company',
  'Japanese Company',
  'Foundry / Manufacturer',
  'Technology / Machinery Supplier',
  'Industry Professional',
];

const memberSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    // No longer collected at registration (see registerMember) — a member
    // applies without a password, and one is generated + emailed to them
    // when an admin approves the application (see approveMember).
    password: { type: String },
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

    // Applications start pending; only 'approved' members can log in. Rejected
    // is kept (not deleted) so admins retain a record of the decision.
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },

    // Manual, admin-set — there is no payment gateway integrated, so this is
    // a status flag rather than a billing record. See lib/theme.ts-adjacent
    // comment style: keep this honest about what it does and doesn't do.
    subscriptionStatus: { type: String, enum: ['none', 'active', 'expired'], default: 'none' },
  },
  { timestamps: true }
);

memberSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

memberSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('Member', memberSchema);
