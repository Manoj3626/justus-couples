const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, default: 'activity' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  time: { type: String, default: 'Just now' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Notification', notificationSchema)
