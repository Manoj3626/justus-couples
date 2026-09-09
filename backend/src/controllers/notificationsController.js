const Notification = require('../models/Notification')

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user._id
    const connectionId = req.user.connectionId

    const query = connectionId
      ? { $or: [{ user: userId }, { connectionId }] }
      : { user: userId }

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(50)
    return res.json({ notifications })
  } catch (err) {
    console.error('Error fetching notifications:', err)
    return res.status(500).json({ message: 'Server error fetching notifications.' })
  }
}

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params
    const notif = await Notification.findById(id)
    if (!notif) return res.status(404).json({ message: 'Notification not found.' })

    const isOwner = notif.user?.equals(req.user._id) || (req.user.connectionId && notif.connectionId?.equals(req.user.connectionId))
    if (!isOwner) return res.status(403).json({ message: 'Unauthorized access to this notification.' })

    notif.read = true
    await notif.save()
    return res.json({ notification: notif })
  } catch (err) {
    console.error('Error marking notification read:', err)
    return res.status(500).json({ message: 'Server error updating notification.' })
  }
}

exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id
    await Notification.updateMany({ user: userId, read: false }, { $set: { read: true } })
    return res.json({ message: 'All notifications marked as read.' })
  } catch (err) {
    console.error('Error marking all notifications read:', err)
    return res.status(500).json({ message: 'Server error updating notifications.' })
  }
}
