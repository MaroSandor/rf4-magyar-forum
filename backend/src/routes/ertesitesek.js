const express = require('express')
const { eq, desc } = require('drizzle-orm')
const { db } = require('../db/index')
const { ertesitesek } = require('../db/schema/ertesitesek')
const { users } = require('../db/schema/users')
const { authenticate } = require('../middleware/authenticate')

const router = express.Router()

// VÉDETT — mindenki csak a saját értesítéseit látja
router.get('/', authenticate, (req, res) => {
  const result = db
    .select({
      id:            ertesitesek.id,
      type:          ertesitesek.type,
      text:          ertesitesek.text,
      detail:        ertesitesek.detail,
      read:          ertesitesek.read,
      createdAt:     ertesitesek.createdAt,
      fromUserName:  users.username,
      fromUserColor: users.avatarColor,
    })
    .from(ertesitesek)
    .leftJoin(users, eq(ertesitesek.fromUserId, users.id))
    .where(eq(ertesitesek.userId, req.user.id))  // ← tokenből jön, nem query paramból
    .orderBy(desc(ertesitesek.createdAt))
    .all()

  res.json(result.map((e) => ({ ...e, read: e.read === 1 })))
})

// VÉDETT — csak a saját értesítést jelölheted olvasottnak
router.patch('/read-all', authenticate, (req, res) => {
  db.update(ertesitesek).set({ read: 1 }).where(eq(ertesitesek.userId, req.user.id)).run()
  res.json({ ok: true })
})

router.patch('/:id/read', authenticate, (req, res) => {
  const id = parseInt(req.params.id)

  const ert = db.select().from(ertesitesek).where(eq(ertesitesek.id, id)).get()
  if (!ert) return res.status(404).json({ error: 'Értesítés nem található.' })

  if (ert.userId !== req.user.id) {
    return res.status(403).json({ error: 'Csak a saját értesítésedet jelölheted olvasottnak.' })
  }

  db.update(ertesitesek).set({ read: 1 }).where(eq(ertesitesek.id, id)).run()
  res.json({ ok: true })
})

// VÉDETT — csak saját értesítést törölhetsz
router.delete('/:id', authenticate, (req, res) => {
  const id = parseInt(req.params.id)

  const ert = db.select().from(ertesitesek).where(eq(ertesitesek.id, id)).get()
  if (!ert) return res.status(404).json({ error: 'Értesítés nem található.' })

  if (ert.userId !== req.user.id) {
    return res.status(403).json({ error: 'Csak a saját értesítésedet törölheted.' })
  }

  db.delete(ertesitesek).where(eq(ertesitesek.id, id)).run()
  res.json({ ok: true })
})

module.exports = router
