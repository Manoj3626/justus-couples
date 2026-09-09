const User = require('../models/User')
const Connection = require('../models/Connection')

// 1. Get/Generate Connection Code for current user
exports.createCode = async (req, res) => {
  try {
    const user = req.user
    if (!user.connectionCode) {
      user.connectionCode = `JUSTUS-${Math.floor(1000 + Math.random() * 9000)}`
      await user.save()
    }
    return res.json({ code: user.connectionCode })
  } catch (err) {
    return res.status(500).json({ message: 'Server error generating code.' })
  }
}

// 2. Connect Space using Connection Code
exports.connectSpace = async (req, res) => {
  const { code } = req.body
  if (!code || !code.trim()) {
    return res.status(400).json({ message: 'Connection code is required.' })
  }

  const cleanCode = code.trim().toUpperCase()
  const currentUser = req.user

  if (currentUser.connectionCode && currentUser.connectionCode.toUpperCase() === cleanCode) {
    return res.status(400).json({ message: 'You cannot connect using your own connection code!' })
  }

  try {
    // Check if target code belongs to a registered user
    const targetUser = await User.findOne({ connectionCode: cleanCode })

    if (!targetUser) {
      return res.status(404).json({ message: 'Invalid connection code. No user found with this code.' })
    }

    if (targetUser._id.equals(currentUser._id)) {
      return res.status(400).json({ message: 'You cannot connect with yourself!' })
    }

    // Check if a Connection document already exists for this code
    let connection = await Connection.findOne({ code: cleanCode })

    if (!connection) {
      connection = new Connection({
        code: cleanCode,
        user1: targetUser._id,
        user2: currentUser._id,
        status: 'CONNECTED',
        connectedAt: new Date(),
      })
    } else {
      connection.user2 = currentUser._id
      connection.status = 'CONNECTED'
      connection.connectedAt = new Date()
    }

    await connection.save()

    // Update both users' records
    currentUser.connectionId = connection._id
    currentUser.partnerId = targetUser._id
    await currentUser.save()

    targetUser.connectionId = connection._id
    targetUser.partnerId = currentUser._id
    await targetUser.save()

    return res.json({
      connected: true,
      code: cleanCode,
      partnerName: targetUser.firstName,
      partnerEmail: targetUser.email,
      connectedAt: connection.connectedAt,
      message: `Connected space successfully with ${targetUser.firstName}! ❤️`,
    })
  } catch (err) {
    console.error('Connect space error:', err)
    return res.status(500).json({ message: 'Server error during space connection.' })
  }
}

// 3. Disconnect / Remove Space Connection
exports.disconnectSpace = async (req, res) => {
  try {
    const currentUser = req.user

    if (currentUser.connectionId) {
      const connection = await Connection.findById(currentUser.connectionId)
      if (connection) {
        connection.status = 'DISCONNECTED'
        connection.disconnectedAt = new Date()
        await connection.save()
      }
    }

    // Clear partner reference for partner if exists
    if (currentUser.partnerId) {
      const partner = await User.findById(currentUser.partnerId)
      if (partner) {
        partner.connectionId = null
        partner.partnerId = null
        await partner.save()
      }
    }

    currentUser.connectionId = null
    currentUser.partnerId = null
    await currentUser.save()

    return res.json({
      connected: false,
      code: currentUser.connectionCode,
      partnerName: null,
      message: 'Space connection removed successfully.',
    })
  } catch (err) {
    console.error('Disconnect space error:', err)
    return res.status(500).json({ message: 'Server error disconnecting space.' })
  }
}
