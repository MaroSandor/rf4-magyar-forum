const express = require('express')
const { eq } = require('drizzle-orm')
const { db } = require('../db/index')
const { spotok } = require('../db/schema/spotok')

const router = express.Router()

// GET /api/spotok
router.get('/', (req, res) => {
  const result = db.select().from(spotok).all()

  const parsed = result.map((s) => ({
    ...s,
    halfajok: s.halfajok ? JSON.parse(s.halfajok) : [],
    tags:     s.tags     ? JSON.parse(s.tags)     : [],
  }))

  res.json(parsed)
})

// GET /api/spotok/:id
router.get('/:id', (req, res) => {
  const spot = db.select().from(spotok).where(eq(spotok.id, parseInt(req.params.id))).get()
  if (!spot) return res.status(404).json({ error: 'Spot nem található.' })

  res.json({
    ...spot,
    halfajok: JSON.parse(spot.halfajok || '[]'),
    tags:     JSON.parse(spot.tags     || '[]'),
  })
})

module.exports = router
