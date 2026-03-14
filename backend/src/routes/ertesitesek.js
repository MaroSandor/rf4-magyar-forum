const express = require('express')
const { eq, desc } = require('drizzle-orm')
const { db } = require('../db/index')
const { ertesitesek } = require('../db/schema/ertesitesek')
const { users } = require('../db/schema/users')
const { authenticate } = require('../middleware/authenticate')

const router = express.Router()

// VÉDETT
router.get('/', authenticate, async (req, res) => {
  const result = await db
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
    .where(eq(ertesitesek.userId, req.user.id))
    .orderBy(desc(ertesitesek.createdAt))

  res.json(result.map((e) => ({ ...e, read: e.read === 1 })))
})

// VÉDETT
router.patch('/read-all', authenticate, async (req, res) => {
  await db.update(ertesitesek).set({ read: 1 }).where(eq(ertesitesek.userId, req.user.id))
  res.json({ ok: true })
})

router.patch('/:id/read', authenticate, async (req, res) => {
  const id = parseInt(req.params.id)

  const ert = (await db.select().from(ertesitesek).where(eq(ertesitesek.id, id)))[0]
  if (!ert) return res.status(404).json({ error: 'Értesítés nem található.' })

  if (ert.userId !== req.user.id) {
    return res.status(403).json({ error: 'Csak a saját értesítésedet jelölheted olvasottnak.' })
  }

  await db.update(ertesitesek).set({ read: 1 }).where(eq(ertesitesek.id, id))
  res.json({ ok: true })
})

// VÉDETT
router.delete('/:id', authenticate, async (req, res) => {
  const id = parseInt(req.params.id)

  const ert = (await db.select().from(ertesitesek).where(eq(ertesitesek.id, id)))[0]
  if (!ert) return res.status(404).json({ error: 'Értesítés nem található.' })

  if (ert.userId !== req.user.id) {
    return res.status(403).json({ error: 'Csak a saját értesítésedet törölheted.' })
  }

  await db.delete(ertesitesek).where(eq(ertesitesek.id, id))
  res.json({ ok: true })
})

module.exports = router
