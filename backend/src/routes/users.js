const express = require('express')
const { eq, desc } = require('drizzle-orm')
const { db } = require('../db/index')
const { users } = require('../db/schema/users')

const router = express.Router()

// GET /api/users/leaderboard — top 5 pont alapján
router.get('/leaderboard', (req, res) => {
  const result = db
    .select({
      id:          users.id,
      username:    users.username,
      level:       users.level,
      points:      users.points,
      avatarColor: users.avatarColor,
    })
    .from(users)
    .orderBy(desc(users.points))
    .limit(5)
    .all()

  res.json(result)
})

// GET /api/users/:id
router.get('/:id', (req, res) => {
  const user = db
    .select({ id: users.id, username: users.username, level: users.level, points: users.points, avatarColor: users.avatarColor, role: users.role, createdAt: users.createdAt })
    .from(users)
    .where(eq(users.id, parseInt(req.params.id)))
    .get()

  if (!user) return res.status(404).json({ error: 'Felhasználó nem található.' })
  res.json(user)
})

module.exports = router
