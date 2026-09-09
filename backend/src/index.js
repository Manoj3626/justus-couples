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

const app = express()
const server = http.createServer(app)

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  })
)
app.use(express.json({ limit: '200mb' }))
app.use(express.urlencoded({ limit: '200mb', extended: true }))
app.use(cookieParser())

app.use(
  cors({
    origin: true,
    credentials: true,
  })
)

app.use(morgan('dev'))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
})
app.use('/api/', limiter)

// Serve Uploaded Files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/space', spaceRoutes)
app.use('/api/dates', datesRoutes)
app.use('/api/memories', memoriesRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/notifications', notificationsRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/music', musicRoutes)

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
    origin: '*',
    credentials: true,
  },
})

setupSocketIO(io)
app.set('io', io)

const PORT = process.env.PORT || 5000

if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET not set — using insecure default for local development')
  process.env.JWT_SECRET = 'dev_jwt_secret_change_me'
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

    const { seedDefaultUsers } = require('./services/seed')
    await seedDefaultUsers()

    server.listen(PORT, () => {
      console.log(`🚀 JustUs Combined Full-Stack Application running on port ${PORT}`)
    })
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err)
    process.exit(1)
  }
}

start()
