const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// A self-service user identity — distinct from Member (an approval-gated
// business membership application, see MembershipApplication.js) and from
// User (internal admin/staff, see User.js). Signing up here needs no admin
// action: choose a password, verify the email, done. Applying for
// membership is a separate step an Account holder can take afterwards —
// see MembershipApplication.account.
const accountSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String, required: true },

    emailVerified: { type: Boolean, default: false },
    // Hashed with the same sha256 helper the token itself is compared
    // against — see accountController — so a leaked DB dump doesn't hand
    // out live verification/reset links. Cleared once used.
    emailVerificationTokenHash: { type: String },
    emailVerificationExpires: { type: Date },
    passwordResetTokenHash: { type: String },
    passwordResetExpires: { type: Date },
  },
  { timestamps: true }
);

accountSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

accountSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('Account', accountSchema);
