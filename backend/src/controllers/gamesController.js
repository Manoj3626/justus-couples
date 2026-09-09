const GameSession = require('../models/GameSession')
const User = require('../models/User')
const Connection = require('../models/Connection')

exports.getSession = async (req, res) => {
  try {
    let connectionId = req.user.connectionId
    if (!connectionId) {
      const conn = await Connection.findOne({
        $or: [{ user1: req.user._id }, { user2: req.user._id }],
        status: 'CONNECTED',
      })
      if (conn) connectionId = conn._id
    }

    if (!connectionId) {
      return res.status(400).json({ message: 'You must be connected to a partner to play couple games.' })
    }

    const { gameId } = req.params
    let session = await GameSession.findOne({ connectionId, gameId, status: 'IN_PROGRESS' })

    if (!session) {
      session = new GameSession({
        connectionId,
        gameId,
        currentQuestion: 0,
        score: 0,
        userAnswers: [],
        status: 'IN_PROGRESS',
      })
      await session.save()
    }

    return res.json({ session })
  } catch (err) {
    console.error('Error fetching game session:', err)
    return res.status(500).json({ message: 'Server error fetching game session.' })
  }
}

exports.submitAnswer = async (req, res) => {
  try {
    const { gameId } = req.params
    const { questionIdx, optionIdx } = req.body

    let connectionId = req.user.connectionId
    if (!connectionId) {
      const conn = await Connection.findOne({
        $or: [{ user1: req.user._id }, { user2: req.user._id }],
        status: 'CONNECTED',
      })
      if (conn) connectionId = conn._id
    }

    if (!connectionId) {
      return res.status(400).json({ message: 'No active connection found.' })
    }

    let session = await GameSession.findOne({ connectionId, gameId, status: 'IN_PROGRESS' })
    if (!session) {
      session = new GameSession({
        connectionId,
        gameId,
        currentQuestion: questionIdx || 0,
        score: 0,
        userAnswers: [],
        status: 'IN_PROGRESS',
      })
    }

    // Filter existing answer for this question and user
    session.userAnswers = session.userAnswers.filter(
      (ans) => !(ans.userId.equals(req.user._id) && ans.questionIdx === questionIdx)
    )

    session.userAnswers.push({
      userId: req.user._id,
      questionIdx,
      optionIdx,
      updatedAt: new Date(),
    })

    session.currentQuestion = questionIdx
    session.updatedAt = new Date()

    await session.save()

    const io = req.app.get('io')
    if (io) {
      io.to(`space_${connectionId}`).emit('game_action', {
        action: 'answer_submitted',
        gameId,
        userId: req.user._id,
        questionIdx,
        optionIdx,
        session,
      })
    }

    return res.json({ session, message: 'Answer recorded! ❤️' })
  } catch (err) {
    console.error('Error submitting answer:', err)
    return res.status(500).json({ message: 'Server error saving game answer.' })
  }
}

exports.resetSession = async (req, res) => {
  try {
    const { gameId } = req.params
    let connectionId = req.user.connectionId
    if (!connectionId) {
      const conn = await Connection.findOne({
        $or: [{ user1: req.user._id }, { user2: req.user._id }],
        status: 'CONNECTED',
      })
      if (conn) connectionId = conn._id
    }

    if (connectionId) {
      await GameSession.deleteMany({ connectionId, gameId })
    }

    const io = req.app.get('io')
    if (io && connectionId) {
      io.to(`space_${connectionId}`).emit('game_action', {
        action: 'game_reset',
        gameId,
      })
    }

    return res.json({ message: 'Game session reset successfully.' })
  } catch (err) {
    console.error('Error resetting game session:', err)
    return res.status(500).json({ message: 'Server error resetting game.' })
  }
}
