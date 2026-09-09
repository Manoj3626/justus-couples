const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  connectionCode: { type: String, unique: true, uppercase: true },
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  connectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Connection', default: null },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('User', userSchema)
