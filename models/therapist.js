const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const therapistSchema = new mongoose.Schema({
  therapistName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  approved: { type: Boolean, default: false }, // ✅ Standardized field name
  studentsAssigned: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
});

// ✅ Hash password before saving
therapistSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('Therapist', therapistSchema);
