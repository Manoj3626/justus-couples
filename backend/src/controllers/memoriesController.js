const MemoryFolder = require('../models/MemoryFolder')
const Memory = require('../models/Memory')

// --- Folder Management ---

exports.getFolders = async (req, res) => {
  try {
    const userId = req.user._id
    const connectionId = req.user.connectionId

    const query = connectionId
      ? { $or: [{ connectionId }, { user: userId }] }
      : { user: userId }

    const folders = await MemoryFolder.find(query).sort({ createdAt: -1 })
    
    // Attach item counts
    const foldersWithCounts = await Promise.all(
      folders.map(async (folder) => {
        const photosCount = await Memory.countDocuments({ folderId: folder._id, mediaType: 'photo' })
        const videosCount = await Memory.countDocuments({ folderId: folder._id, mediaType: 'video' })
        return {
          ...folder.toObject(),
          photosCount,
          videosCount,
        }
      })
    )

    return res.json({ folders: foldersWithCounts })
  } catch (err) {
    console.error('Error fetching folders:', err)
    return res.status(500).json({ message: 'Server error fetching memory folders.' })
  }
}

exports.createFolder = async (req, res) => {
  try {
    const { name } = req.body
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Folder name is required.' })
    }

    const newFolder = new MemoryFolder({
      user: req.user._id,
      userId: req.user._id,
      connectionId: req.user.connectionId || null,
      name: name.trim(),
    })

    await newFolder.save()
    return res.status(201).json({ folder: { ...newFolder.toObject(), photosCount: 0, videosCount: 0 }, message: 'Folder created successfully!' })
  } catch (err) {
    console.error('Error creating folder:', err)
    return res.status(500).json({ message: 'Server error creating memory folder.' })
  }
}

exports.renameFolder = async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'New folder name is required.' })
    }

    const folder = await MemoryFolder.findById(id)
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found.' })
    }

    const isOwner = (folder.user && folder.user.equals(req.user._id)) ||
                    (req.user.connectionId && folder.connectionId && folder.connectionId.equals(req.user.connectionId))
    if (!isOwner) {
      return res.status(403).json({ message: 'Unauthorized access to this folder.' })
    }

    folder.name = name.trim()
    await folder.save()

    return res.json({ folder, message: 'Folder renamed successfully.' })
  } catch (err) {
    console.error('Error renaming folder:', err)
    return res.status(500).json({ message: 'Server error renaming folder.' })
  }
}

exports.deleteFolder = async (req, res) => {
  try {
    const { id } = req.params

    const folder = await MemoryFolder.findById(id)
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found.' })
    }

    const isOwner = (folder.user && folder.user.equals(req.user._id)) ||
                    (req.user.connectionId && folder.connectionId && folder.connectionId.equals(req.user.connectionId))
    if (!isOwner) {
      return res.status(403).json({ message: 'Unauthorized access to this folder.' })
    }

    // Delete associated memories in this folder
    await Memory.deleteMany({ folderId: id })
    await MemoryFolder.findByIdAndDelete(id)

    return res.json({ message: 'Folder and its contents deleted successfully.' })
  } catch (err) {
    console.error('Error deleting folder:', err)
    return res.status(500).json({ message: 'Server error deleting folder.' })
  }
}

// --- Memories Management ---

exports.getMemories = async (req, res) => {
  try {
    const userId = req.user._id
    const connectionId = req.user.connectionId
    const { folderId } = req.query

    const filter = {
      ...(connectionId ? { $or: [{ connectionId }, { user: userId }] } : { user: userId }),
      ...(folderId ? { folderId } : {}),
    }

    const memories = await Memory.find(filter).sort({ createdAt: -1 })
    return res.json({ memories })
  } catch (err) {
    console.error('Error fetching memories:', err)
    return res.status(500).json({ message: 'Server error fetching memories.' })
  }
}

const { uploadFile } = require('../services/storageService')

exports.uploadMemory = async (req, res) => {
  try {
    const { folderId, title, url, mediaUrl, mediaType, favorite, note } = req.body
    let mediaPath = (url || mediaUrl || '').trim()

    if (req.file) {
      mediaPath = await uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype)
    } else if (req.body.fileData && req.body.fileName) {
      const base64Data = req.body.fileData.replace(/^data:[^;]+;base64,/, '')
      const buffer = Buffer.from(base64Data, 'base64')
      mediaPath = await uploadFile(buffer, req.body.fileName, 'image/jpeg')
    }

    const newMemory = new Memory({
      user: req.user._id,
      userId: req.user._id,
      connectionId: req.user.connectionId || null,
      folderId: folderId || null,
      title: title ? title.trim() : 'Untitled Memory',
      url: mediaPath,
      mediaUrl: mediaPath,
      mediaType: mediaType === 'video' ? 'video' : 'photo',
      favorite: Boolean(favorite),
      note: note ? note.trim() : '',
    })

    await newMemory.save()
    return res.status(201).json({ memory: newMemory, message: 'Memory saved successfully! ❤️' })
  } catch (err) {
    console.error('Error uploading memory:', err)
    return res.status(500).json({ message: 'Server error uploading memory.' })
  }
}

exports.toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params
    const memory = await Memory.findById(id)

    if (!memory) {
      return res.status(404).json({ message: 'Memory not found.' })
    }

    const isOwner = (memory.user && memory.user.equals(req.user._id)) ||
                    (req.user.connectionId && memory.connectionId && memory.connectionId.equals(req.user.connectionId))
    if (!isOwner) {
      return res.status(403).json({ message: 'Unauthorized access to this memory.' })
    }

    memory.favorite = !memory.favorite
    await memory.save()

    return res.json({ memory, message: memory.favorite ? 'Marked as favorite ❤️' : 'Removed from favorites' })
  } catch (err) {
    console.error('Error toggling favorite:', err)
    return res.status(500).json({ message: 'Server error updating memory.' })
  }
}

exports.deleteMemory = async (req, res) => {
  try {
    const { id } = req.params
    const memory = await Memory.findById(id)

    if (!memory) {
      return res.status(404).json({ message: 'Memory not found.' })
    }

    const isOwner = (memory.user && memory.user.equals(req.user._id)) ||
                    (req.user.connectionId && memory.connectionId && memory.connectionId.equals(req.user.connectionId))
    if (!isOwner) {
      return res.status(403).json({ message: 'Unauthorized access to this memory.' })
    }

    await Memory.findByIdAndDelete(id)
    return res.json({ message: 'Memory deleted successfully.' })
  } catch (err) {
    console.error('Error deleting memory:', err)
    return res.status(500).json({ message: 'Server error deleting memory.' })
  }
}
