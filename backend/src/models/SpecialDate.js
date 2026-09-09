const mongoose = require('mongoose')

const specialDateSchema = new mongoose.Schema({
  connectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Connection' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true, trim: true },
  date: { type: String, required: true },
  time: { type: String, default: '19:00' },
  type: { type: String, default: 'birthday' },
  notes: { type: String, default: '' },
  remindSms: { type: Boolean, default: true },
  remindInApp: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('SpecialDate', specialDateSchema)
