const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { eq } = require('drizzle-orm')
const { db } = require('../db/index')
const { users } = require('../db/schema/users')
const { authenticate } = require('../middleware/authenticate')

const router = express.Router()

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

// --- POST /api/auth/register ---
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Felhasználónév, email és jelszó kötelező.' })
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'A jelszó legalább 6 karakter legyen.' })
  }

  const existing = (await db.select().from(users).where(eq(users.email, email)))[0]

  if (existing) {
    return res.status(409).json({ error: 'Ez az email cím már foglalt.' })
  }

  const existingUsername = (await db.select().from(users).where(eq(users.username, username)))[0]

  if (existingUsername) {
    return res.status(409).json({ error: 'Ez a felhasználónév már foglalt.' })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const [newUser] = await db
    .insert(users)
    .values({ username, email, passwordHash, createdAt: new Date().toISOString() })
    .returning()

  const token = jwt.sign(
    { id: newUser.id, username: newUser.username, role: newUser.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.cookie('token', token, COOKIE_OPTIONS)

  res.status(201).json({
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      level: newUser.level,
    }
  })
})

// --- POST /api/auth/login ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email és jelszó kötelező.' })
  }

  const user = (await db.select().from(users).where(eq(users.email, email)))[0]

  if (!user) {
    return res.status(401).json({ error: 'Hibás email vagy jelszó.' })
  }

  const match = await bcrypt.compare(password, user.passwordHash)

  if (!match) {
    return res.status(401).json({ error: 'Hibás email vagy jelszó.' })
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.cookie('token', token, COOKIE_OPTIONS)

  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      level: user.level,
      points: user.points,
      avatarColor: user.avatarColor,
    }
  })
})

// --- POST /api/auth/logout ---
router.post('/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'strict' })
  res.json({ ok: true })
})

// --- GET /api/auth/me ---
router.get('/me', authenticate, async (req, res) => {
  const user = (await db
    .select({
      id: users.id, username: users.username, email: users.email,
      role: users.role, level: users.level, points: users.points,
      avatarColor: users.avatarColor, createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, req.user.id)))[0]

  if (!user) return res.status(404).json({ error: 'Felhasználó nem található.' })

  res.json(user)
})

module.exports = router
