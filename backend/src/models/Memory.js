const mongoose = require('mongoose')

const memorySchema = new mongoose.Schema({
  connectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Connection' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'MemoryFolder', default: null },
  title: { type: String, required: true, trim: true },
  category: { type: String, default: 'General' },
  date: { type: String },
  note: { type: String, default: '' },
  mediaUrl: { type: String },
  url: { type: String },
  mediaType: { type: String, enum: ['photo', 'video'], default: 'photo' },
  favorite: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Memory', memorySchema)
