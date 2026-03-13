const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { eq } = require('drizzle-orm')
const { db } = require('../db/index')
const { users } = require('../db/schema/users')
const { authenticate } = require('../middleware/authenticate')

const router = express.Router()

// Cookie beállítások — egy helyen definiálva, mindenhol ugyanaz
const COOKIE_OPTIONS = {
  httpOnly: true,       // JavaScript nem látja
  sameSite: 'strict',   // CSRF védelem
  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 nap milliszekundumban
  // secure: true — ezt élesben kell bekapcsolni (HTTPS)
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

  // Ellenőrizzük hogy létezik-e már ez az email vagy username
  const existing = db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get()

  if (existing) {
    return res.status(409).json({ error: 'Ez az email cím már foglalt.' })
  }

  const existingUsername = db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .get()

  if (existingUsername) {
    return res.status(409).json({ error: 'Ez a felhasználónév már foglalt.' })
  }

  // bcrypt.hash() aszinkron — a 10 a salt rounds száma
  const passwordHash = await bcrypt.hash(password, 10)

  const [newUser] = db
    .insert(users)
    .values({ username, email, passwordHash, createdAt: new Date().toISOString() })
    .returning()
    .all()

  // Regisztráció után rögtön be is jelentkeztetjük
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

  // Megkeressük a felhasználót email alapján
  const user = db.select().from(users).where(eq(users.email, email)).get()

  // Szándékosan ugyanolyan hibaüzenet — nem árulunk el hogy az email létezik-e
  if (!user) {
    return res.status(401).json({ error: 'Hibás email vagy jelszó.' })
  }

  // bcrypt.compare() összehasonlítja a beírt jelszót a hash-sel
  const match = await bcrypt.compare(password, user.passwordHash)

  if (!match) {
    return res.status(401).json({ error: 'Hibás email vagy jelszó.' })
  }

  // JWT token generálása — a payload tartalmazza a szükséges adatokat
  // NE tegyél bele jelszót vagy érzékeny adatot!
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

  // Token beállítása httpOnly cookie-ként
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
  // Cookie törlése = üres értékű, azonnal lejáró cookie küldése
  res.clearCookie('token', { httpOnly: true, sameSite: 'strict' })
  res.json({ ok: true })
})

// --- GET /api/auth/me ---
// Visszaadja a bejelentkezett felhasználó adatait a token alapján.
// A frontend ezt hívja oldalbetöltéskor, hogy tudja be van-e lépve a user.
router.get('/me', authenticate, (req, res) => {
  // req.user az authenticate middleware-től jön
  const user = db
    .select({
      id: users.id, username: users.username, email: users.email,
      role: users.role, level: users.level, points: users.points,
      avatarColor: users.avatarColor, createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, req.user.id))
    .get()

  if (!user) return res.status(404).json({ error: 'Felhasználó nem található.' })

  res.json(user)
})

module.exports = router
