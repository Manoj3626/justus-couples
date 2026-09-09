const express = require('express')
const router = express.Router()
const multer = require('multer')
const authMiddleware = require('../middleware/auth')
const { uploadFile } = require('../services/storageService')

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB Max limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/') || file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only audio, video, and image files are allowed!'), false)
    }
  },
})

// Upload Media File for Shared Room Streaming (Supports multipart/form-data & JSON base64)
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    let fileBuffer, fileName, mimeType

    if (req.file) {
      fileBuffer = req.file.buffer
      fileName = req.file.originalname
      mimeType = req.file.mimetype
    } else if (req.body && req.body.fileData && req.body.fileName) {
      fileName = req.body.fileName
      mimeType = 'audio/mpeg'
      const base64Data = req.body.fileData.replace(/^data:[^;]+;base64,/, '')
      fileBuffer = Buffer.from(base64Data, 'base64')
    } else {
      return res.status(400).json({ message: 'No media file or fileData provided' })
    }

    const fileUrl = await uploadFile(fileBuffer, fileName, mimeType)

    res.json({
      success: true,
      url: fileUrl,
      fileName,
    })
  } catch (err) {
    console.error('Error uploading media file:', err)
    res.status(500).json({ message: 'Failed to upload media file: ' + err.message })
  }
})

module.exports = router
