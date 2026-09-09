const mongoose = require('mongoose')

const gameSessionSchema = new mongoose.Schema({
  connectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Connection', required: true, index: true },
  gameId: { type: String, required: true },
  currentQuestion: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  userAnswers: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      questionIdx: { type: Number },
      optionIdx: { type: Number },
      updatedAt: { type: Date, default: Date.now },
    },
  ],
  status: { type: String, enum: ['IN_PROGRESS', 'COMPLETED'], default: 'IN_PROGRESS' },
  updatedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('GameSession', gameSessionSchema)
