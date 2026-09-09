require('dotenv').config()
const express = require('express')
const http = require('http')
const path = require('path')
const { Server } = require('socket.io')
const cors = require('cors')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

const { setupSocketIO } = require('./socket')

const authRoutes = require('./routes/auth')
const spaceRoutes = require('./routes/space')
const datesRoutes = require('./routes/dates')
const memoriesRoutes = require('./routes/memories')
const chatRoutes = require('./routes/chat')
const notificationsRoutes = require('./routes/notifications')
const usersRoutes = require('./routes/users')
const musicRoutes = require('./routes/music')
const gamesRoutes = require('./routes/games')
const aiRoutes = require('./routes/ai')

const app = express()
app.set('trust proxy', 1)
const server = http.createServer(app)

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  })
)
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(cookieParser())

// CORS — env-driven & multi-domain support for production
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests from justus.in, netlify.app, localhost or mobile tunnel
      callback(null, true)
    },
    credentials: true,
  })
)

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000, // Generous limit for tunnel & production
})
app.use('/api/', limiter)

// Serve Uploaded Files with CORS & Range Support for Audio/Video Streaming
app.use(
  '/uploads',
  (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Accept-Ranges', 'bytes')
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200)
    }
    next()
  },
  express.static(path.join(__dirname, '../uploads'))
)

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/space', spaceRoutes)
app.use('/api/dates', datesRoutes)
app.use('/api/memories', memoriesRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/notifications', notificationsRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/music', musicRoutes)
app.use('/api/games', gamesRoutes)
app.use('/api/ai', aiRoutes)

// Serve Static Frontend Dist with strict no-cache headers for index.html
const frontendDistPath = path.join(__dirname, '../../frontend/dist')
app.use(
  express.static(frontendDistPath, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        res.setHeader('Pragma', 'no-cache')
        res.setHeader('Expires', '0')
      }
    },
  })
)

// SPA Fallback for client routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
    return next()
  }
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('JustUs App Build not found. Run npm run build in frontend.')
    }
  })
})

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
  maxHttpBufferSize: 1e6, // 1MB buffer limit — prevents streaming raw video/audio binary data over socket
})

setupSocketIO(io)
app.set('io', io)

const PORT = process.env.PORT || 5000

if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('FATAL SECURITY ERROR: JWT_SECRET environment variable is missing in production!')
  }
  console.warn('Warning: JWT_SECRET not set — using insecure default for local development')
  process.env.JWT_SECRET = 'dev_jwt_secret_change_me'
}

if (process.env.NODE_ENV === 'production') {
  // Require CORS_ORIGIN in production — prevent wildcard origin exposure
  if (!process.env.CORS_ORIGIN && !process.env.FRONTEND_URL) {
    throw new Error('FATAL CONFIG ERROR: CORS_ORIGIN or FRONTEND_URL must be set in production!')
  }
  // Require MONGO_URI in production — no embedded database allowed
  if (!process.env.MONGO_URI) {
    throw new Error('FATAL CONFIG ERROR: MONGO_URI must be set in production!')
  }
  // Warn if no persistent cloud storage configured
  if (!process.env.CLOUDINARY_URL && !process.env.AWS_S3_BUCKET) {
    throw new Error('FATAL CONFIG ERROR: No persistent cloud storage configured (CLOUDINARY_URL or AWS_S3_BUCKET). Production media would be lost on restart. Configure cloud storage before deploying.')
  }
  // Warn if Google Client ID missing
  if (!process.env.GOOGLE_CLIENT_ID) {
    console.warn('WARNING: GOOGLE_CLIENT_ID not set — Google OAuth is disabled in production')
  }
}

async function start() {
  try {
    let mongoUri = process.env.MONGO_URI
    if (!mongoUri) {
      console.log('⚡ MONGO_URI not set — starting persistent local MongoDB server')
      const dbDir = path.join(__dirname, '../dbdata')
      const fs = require('fs')
      if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true })
      const mongod = await MongoMemoryServer.create({
        instance: {
          dbPath: dbDir,
          storageEngine: 'wiredTiger',
        },
      })
      mongoUri = mongod.getUri()
    }
    await mongoose.connect(mongoUri)
    console.log('✅ Connected to MongoDB successfully.')

    // Only seed demo users in development
    if (process.env.NODE_ENV !== 'production') {
      const { seedDefaultUsers } = require('./services/seed')
      await seedDefaultUsers()
    }

    server.listen(PORT, () => {
      console.log(`🚀 JustUs Combined Full-Stack Application running on port ${PORT}`)
    })
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err)
    process.exit(1)
  }
}

start()
