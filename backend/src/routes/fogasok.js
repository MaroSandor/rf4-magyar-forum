const express = require('express')
const { eq, desc } = require('drizzle-orm')
const { db } = require('../db/index')
const { fogasok } = require('../db/schema/fogasok')
const { users } = require('../db/schema/users')
const { authenticate } = require('../middleware/authenticate')

const router = express.Router()

// NYILVÁNOS
router.get('/', (req, res) => {
  const result = db
    .select({
      id:          fogasok.id,
      halfaj:      fogasok.halfaj,
      suly:        fogasok.suly,
      hossz:       fogasok.hossz,
      spot:        fogasok.spot,
      csali:       fogasok.csali,
      melyseg:     fogasok.melyseg,
      idojaras:    fogasok.idojaras,
      fogasIdeje:  fogasok.fogasIdeje,
      leiras:      fogasok.leiras,
      tags:        fogasok.tags,
      votes:       fogasok.votes,
      createdAt:   fogasok.createdAt,
      authorName:  users.username,
      authorColor: users.avatarColor,
      authorId:    fogasok.userId,
    })
    .from(fogasok)
    .leftJoin(users, eq(fogasok.userId, users.id))
    .orderBy(desc(fogasok.votes))
    .all()

  res.json(result.map((f) => ({ ...f, tags: f.tags ? JSON.parse(f.tags) : [] })))
})

// VÉDETT — csak bejelentkezett user oszthat meg fogást
router.post('/', authenticate, (req, res) => {
  const { halfaj, suly, hossz, spot, csali, melyseg, idojaras, fogasIdeje, leiras, tags } = req.body

  if (!halfaj || !suly) {
    return res.status(400).json({ error: 'Halfaj és súly kötelező.' })
  }

  const [newFogas] = db
    .insert(fogasok)
    .values({
      halfaj, suly, hossz, spot, csali, melyseg, idojaras, fogasIdeje, leiras,
      tags: tags ? JSON.stringify(tags) : '[]',
      userId: req.user.id,
      createdAt: new Date().toISOString(),
    })
    .returning()
    .all()

  res.status(201).json({ ...newFogas, tags: JSON.parse(newFogas.tags || '[]') })
})

// VÉDETT — bejelentkezett user szavazhat
router.patch('/:id/vote', authenticate, (req, res) => {
  const id = parseInt(req.params.id)
  const { delta } = req.body

  const fogas = db.select().from(fogasok).where(eq(fogasok.id, id)).get()
  if (!fogas) return res.status(404).json({ error: 'Fogás nem található.' })

  const [updated] = db
    .update(fogasok)
    .set({ votes: fogas.votes + (delta === 1 ? 1 : -1) })
    .where(eq(fogasok.id, id))
    .returning()
    .all()

  res.json(updated)
})

// VÉDETT — saját fogás törlése (vagy admin/moderátor bárkit)
router.delete('/:id', authenticate, (req, res) => {
  const id = parseInt(req.params.id)

  const fogas = db.select().from(fogasok).where(eq(fogasok.id, id)).get()
  if (!fogas) return res.status(404).json({ error: 'Fogás nem található.' })

  const isSaját = fogas.userId === req.user.id
  const isEmelt = ['moderator', 'admin'].includes(req.user.role)

  if (!isSaját && !isEmelt) {
    return res.status(403).json({ error: 'Csak a saját fogásodat törölheted.' })
  }

  db.delete(fogasok).where(eq(fogasok.id, id)).run()
  res.json({ ok: true })
})

module.exports = router
