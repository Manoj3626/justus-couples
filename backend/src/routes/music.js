const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const authMiddleware = require('../middleware/auth')

const uploadsDir = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Upload Audio File for Shared Room Streaming
router.post('/upload', authMiddleware, async (req, res) => {
  try {
    const { fileName, fileData } = req.body
    if (!fileName || !fileData) {
      return res.status(400).json({ message: 'Missing fileName or fileData' })
    }

    // Extract base64 payload (supports audio, video, etc.)
    const base64Data = fileData.replace(/^data:[^;]+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    const safeName = fileName.replace(/[^a-zA-Z0-9_.-]/g, '_')
    const uniqueFileName = `music_${Date.now()}_${safeName}`
    const filePath = path.join(uploadsDir, uniqueFileName)

    await fs.promises.writeFile(filePath, buffer)

    const fileUrl = `/uploads/${uniqueFileName}`
    res.json({
      success: true,
      url: fileUrl,
      fileName: safeName,
    })
  } catch (err) {
    console.error('Error uploading music file:', err)
    res.status(500).json({ message: 'Failed to upload music file' })
  }
})

module.exports = router
