const mongoose = require('mongoose')

const connectionSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  status: { type: String, enum: ['CONNECTED', 'DISCONNECTED'], default: 'CONNECTED' },
  connectedAt: { type: Date, default: Date.now },
  disconnectedAt: { type: Date, default: null },
})

module.exports = mongoose.model('Connection', connectionSchema)
