const User = require('../models/User')
const Connection = require('../models/Connection')
const bcrypt = require('bcryptjs')

async function seedDefaultUsers() {
  try {
    const existingAlex = await User.findOne({ email: 'alex@example.com' })
    const existingSam = await User.findOne({ email: 'sam@example.com' })

    if (existingAlex && existingSam && existingAlex.connectionId) {
      console.log('✅ Default seed users (Alex & Sam) already present and connected.')
      return
    }

    const passwordHash = await bcrypt.hash('password123', 10)
    const spaceCode = 'JUSTUS-5977'

    let alex = existingAlex
    if (!alex) {
      alex = new User({
        firstName: 'Alex',
        email: 'alex@example.com',
        password: passwordHash,
        connectionCode: spaceCode,
        isVerified: true,
      })
      await alex.save()
    }

    let sam = existingSam
    if (!sam) {
      sam = new User({
        firstName: 'Sam',
        email: 'sam@example.com',
        password: passwordHash,
        connectionCode: 'JUSTUS-8842',
        isVerified: true,
      })
      await sam.save()
    }

    let conn = await Connection.findOne({ code: spaceCode })
    if (!conn) {
      conn = new Connection({
        code: spaceCode,
        user1: alex._id,
        user2: sam._id,
        status: 'CONNECTED',
        connectedAt: new Date(),
      })
      await conn.save()
    }

    alex.connectionId = conn._id
    alex.partnerId = sam._id
    await alex.save()

    sam.connectionId = conn._id
    sam.partnerId = alex._id
    await sam.save()

    console.log(`✅ Default seed users (Alex & Sam) successfully created and connected with space code ${spaceCode}! ❤️`)
  } catch (err) {
    console.error('Seed error:', err)
  }
}

module.exports = { seedDefaultUsers }
