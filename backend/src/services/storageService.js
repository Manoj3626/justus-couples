const path = require('path')
const fs = require('fs')

const uploadsDir = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

/**
 * Storage Service Abstraction
 * In production: Configured for Cloudinary / AWS S3 persistent object storage via env variables.
 * In development: Safely streams files to uploads directory.
 */
async function uploadFile(fileBuffer, originalName, mimeType) {
  // 1. Cloudinary Provider Strategy (If CLOUDINARY_URL is configured)
  if (process.env.CLOUDINARY_URL) {
    try {
      const cloudinary = require('cloudinary').v2
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto', folder: 'justus' },
          (error, result) => {
            if (error) return reject(error)
            resolve(result.secure_url)
          }
        )
        uploadStream.end(fileBuffer)
      })
    } catch (err) {
      console.error('Cloudinary upload error:', err)
    }
  }

  // 2. Local Disk Fallback Strategy (Dev Environment)
  const safeName = originalName.replace(/[^a-zA-Z0-9_.-]/g, '_')
  const uniqueName = `media_${Date.now()}_${safeName}`
  const filePath = path.join(uploadsDir, uniqueName)

  await fs.promises.writeFile(filePath, fileBuffer)
  return `/uploads/${uniqueName}`
}

module.exports = {
  uploadFile,
}
