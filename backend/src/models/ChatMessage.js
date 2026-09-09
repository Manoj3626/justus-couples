const mongoose = require('mongoose')

const chatMessageSchema = new mongoose.Schema({
  connectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Connection', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  senderName: { type: String },
  text: { type: String, required: true },
  time: { type: String },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('ChatMessage', chatMessageSchema)
