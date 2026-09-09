const ChatMessage = require('../models/ChatMessage')
const User = require('../models/User')
const Connection = require('../models/Connection')
const Notification = require('../models/Notification')

exports.getMessages = async (req, res) => {
  try {
    let connectionId = req.user.connectionId

    if (!connectionId) {
      const freshUser = await User.findById(req.user._id)
      if (freshUser && freshUser.connectionId) {
        connectionId = freshUser.connectionId
      }
    }

    if (!connectionId) {
      const conn = await Connection.findOne({
        $or: [{ user1: req.user._id }, { user2: req.user._id }],
        status: 'CONNECTED',
      })
      if (conn) {
        connectionId = conn._id
        req.user.connectionId = connectionId
        await req.user.save().catch(() => null)
      }
    }

    if (!connectionId) {
      return res.status(400).json({ message: 'You must be connected to a partner to access chat.' })
    }

    const messages = await ChatMessage.find({ connectionId })
      .sort({ createdAt: 1 })
      .populate('sender', 'firstName email')

    return res.json({ messages })
  } catch (err) {
    console.error('Error fetching chat messages:', err)
    return res.status(500).json({ message: 'Server error fetching chat messages.' })
  }
}

exports.sendMessage = async (req, res) => {
  try {
    let connectionId = req.user.connectionId
    let partnerId = req.user.partnerId

    if (!connectionId) {
      const freshUser = await User.findById(req.user._id)
      if (freshUser && freshUser.connectionId) {
        connectionId = freshUser.connectionId
        partnerId = freshUser.partnerId
      }
    }

    if (!connectionId) {
      const conn = await Connection.findOne({
        $or: [{ user1: req.user._id }, { user2: req.user._id }],
        status: 'CONNECTED',
      })
      if (conn) {
        connectionId = conn._id
        partnerId = conn.user1.equals(req.user._id) ? conn.user2 : conn.user1
        req.user.connectionId = connectionId
        req.user.partnerId = partnerId
        await req.user.save().catch(() => null)
      }
    }

    const { text } = req.body

    if (!connectionId) {
      return res.status(400).json({ message: 'You must be connected to a partner to send messages.' })
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Message text is required.' })
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const newMsg = new ChatMessage({
      connectionId,
      sender: req.user._id,
      senderId: req.user._id,
      senderName: req.user.firstName || 'User',
      text: text.trim(),
      time: timeStr,
    })

    await newMsg.save()
    const populated = await ChatMessage.findById(newMsg._id).populate('sender', 'firstName email')

    // Broadcast live over socket to room
    const io = req.app.get('io')
    if (io) {
      io.to(`space_${connectionId}`).emit('new_chat_message', populated)
    }

    if (partnerId) {
      await Notification.create({
        user: partnerId,
        connectionId,
        title: 'New Chat Message',
        message: `${req.user.firstName}: ${text.trim().slice(0, 30)}...`,
        type: 'chat',
      }).catch((e) => console.warn('Failed to create notification:', e))
    }

    return res.status(201).json({ message: populated })
  } catch (err) {
    console.error('Error sending message:', err)
    return res.status(500).json({ message: 'Server error sending message.' })
  }
}
