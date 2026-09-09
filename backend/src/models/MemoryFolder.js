const mongoose = require('mongoose')

const memoryFolderSchema = new mongoose.Schema({
  connectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Connection' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('MemoryFolder', memoryFolderSchema)
