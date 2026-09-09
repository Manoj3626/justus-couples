const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  otpHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
  resendCooldown: { type: Date },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // Auto delete document after 10 mins
})

module.exports = mongoose.model('Otp', otpSchema)
