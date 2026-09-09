const express = require('express')
const router = express.Router()
const multer = require('multer')
const {
  getFolders,
  createFolder,
  renameFolder,
  deleteFolder,
  getMemories,
  uploadMemory,
  toggleFavorite,
  deleteMemory,
} = require('../controllers/memoriesController')
const { protectRoute } = require('../middleware/authMiddleware')

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
})

// Folders
router.get('/folders', protectRoute, getFolders)
router.post('/folders', protectRoute, createFolder)
router.put('/folders/:id', protectRoute, renameFolder)
router.delete('/folders/:id', protectRoute, deleteFolder)

// Memories Media
router.get('/', protectRoute, getMemories)
router.post('/upload', protectRoute, upload.single('file'), uploadMemory)
router.put('/:id/favorite', protectRoute, toggleFavorite)
router.delete('/:id', protectRoute, deleteMemory)

module.exports = router
