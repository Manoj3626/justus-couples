const SpecialDate = require('../models/SpecialDate')

// Get all special dates for current user / space connection
exports.getDates = async (req, res) => {
  try {
    const userId = req.user._id
    const connectionId = req.user.connectionId

    const query = connectionId
      ? { $or: [{ connectionId }, { user: userId }] }
      : { user: userId }

    const dates = await SpecialDate.find(query).sort({ date: 1 })
    return res.json({ dates })
  } catch (err) {
    console.error('Error fetching dates:', err)
    return res.status(500).json({ message: 'Server error fetching special dates.' })
  }
}

// Add a new special date
exports.addDate = async (req, res) => {
  try {
    const { title, date, type, notes, reminder, smsPreference } = req.body

    if (!title || !date) {
      return res.status(400).json({ message: 'Title and Date are required.' })
    }

    const dateStr = typeof date === 'string' ? date : new Date(date).toISOString().split('T')[0]

    const newDate = new SpecialDate({
      user: req.user._id,
      userId: req.user._id,
      connectionId: req.user.connectionId || null,
      title: title.trim(),
      date: dateStr,
      type: type || 'birthday',
      notes: notes ? notes.trim() : '',
      remindInApp: reminder !== undefined ? reminder : true,
      remindSms: Boolean(smsPreference),
    })

    await newDate.save()
    return res.status(201).json({ date: newDate, message: 'Special date added successfully! ❤️' })
  } catch (err) {
    console.error('Error adding date:', err)
    return res.status(500).json({ message: 'Server error creating special date.' })
  }
}

// Update a special date
exports.updateDate = async (req, res) => {
  try {
    const { id } = req.params
    const { title, date, type, notes, reminder, smsPreference } = req.body

    const existingDate = await SpecialDate.findById(id)
    if (!existingDate) {
      return res.status(404).json({ message: 'Special date not found.' })
    }

    const isOwner = (existingDate.user && existingDate.user.equals(req.user._id)) ||
                    (req.user.connectionId && existingDate.connectionId && existingDate.connectionId.equals(req.user.connectionId))
    if (!isOwner) {
      return res.status(403).json({ message: 'Unauthorized access to this date.' })
    }

    if (title !== undefined) existingDate.title = title.trim()
    if (date !== undefined) existingDate.date = new Date(date)
    if (type !== undefined) existingDate.type = type
    if (notes !== undefined) existingDate.notes = notes.trim()
    if (reminder !== undefined) existingDate.reminder = reminder
    if (smsPreference !== undefined) existingDate.smsPreference = smsPreference

    await existingDate.save()
    return res.json({ date: existingDate, message: 'Special date updated successfully.' })
  } catch (err) {
    console.error('Error updating date:', err)
    return res.status(500).json({ message: 'Server error updating special date.' })
  }
}

// Delete a special date
exports.deleteDate = async (req, res) => {
  try {
    const { id } = req.params
    const existingDate = await SpecialDate.findById(id)
    if (!existingDate) {
      return res.status(404).json({ message: 'Special date not found.' })
    }

    const isOwner = (existingDate.user && existingDate.user.equals(req.user._id)) ||
                    (req.user.connectionId && existingDate.connectionId && existingDate.connectionId.equals(req.user.connectionId))
    if (!isOwner) {
      return res.status(403).json({ message: 'Unauthorized access to this date.' })
    }

    await SpecialDate.findByIdAndDelete(id)
    return res.json({ message: 'Special date removed successfully.' })
  } catch (err) {
    console.error('Error deleting date:', err)
    return res.status(500).json({ message: 'Server error deleting special date.' })
  }
}
