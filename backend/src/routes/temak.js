const express = require('express')
const { eq, desc } = require('drizzle-orm')
const { db } = require('../db/index')
const { temak, hozzaszolasok } = require('../db/schema/temak')
const { users } = require('../db/schema/users')
const { authenticate } = require('../middleware/authenticate')
const { authorize } = require('../middleware/authorize')

const router = express.Router()

// NYILVÁNOS — bárki olvashatja
router.get('/', (req, res) => {
  const result = db
    .select({
      id:            temak.id,
      title:         temak.title,
      category:      temak.category,
      categoryColor: temak.categoryColor,
      votes:         temak.votes,
      commentCount:  temak.commentCount,
      createdAt:     temak.createdAt,
      authorName:    users.username,
      authorColor:   users.avatarColor,
    })
    .from(temak)
    .leftJoin(users, eq(temak.userId, users.id))
    .orderBy(desc(temak.createdAt))
    .all()

  res.json(result)
})

// NYILVÁNOS
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id)

  const tema = db
    .select({
      id:            temak.id,
      title:         temak.title,
      content:       temak.content,
      category:      temak.category,
      categoryColor: temak.categoryColor,
      votes:         temak.votes,
      commentCount:  temak.commentCount,
      createdAt:     temak.createdAt,
      authorName:    users.username,
      authorColor:   users.avatarColor,
      authorId:      temak.userId,
    })
    .from(temak)
    .leftJoin(users, eq(temak.userId, users.id))
    .where(eq(temak.id, id))
    .get()

  if (!tema) return res.status(404).json({ error: 'Téma nem található.' })

  const comments = db
    .select({
      id:          hozzaszolasok.id,
      content:     hozzaszolasok.content,
      votes:       hozzaszolasok.votes,
      createdAt:   hozzaszolasok.createdAt,
      authorName:  users.username,
      authorColor: users.avatarColor,
      authorId:    hozzaszolasok.userId,
    })
    .from(hozzaszolasok)
    .leftJoin(users, eq(hozzaszolasok.userId, users.id))
    .where(eq(hozzaszolasok.temaId, id))
    .orderBy(hozzaszolasok.createdAt)
    .all()

  res.json({ ...tema, comments })
})

// VÉDETT — bejelentkezett user hozhat létre témát
router.post('/', authenticate, (req, res) => {
  const { title, content, category, categoryColor } = req.body

  if (!title || !content || !category) {
    return res.status(400).json({ error: 'Cím, tartalom és kategória kötelező.' })
  }

  const [newTema] = db
    .insert(temak)
    .values({
      title, content, category,
      categoryColor: categoryColor || '#4ade80',
      userId: req.user.id,   // ← a tokenből jön, nem a body-ból
      createdAt: new Date().toISOString(),
    })
    .returning()
    .all()

  res.status(201).json(newTema)
})

// VÉDETT — bejelentkezett user kommentelhet
router.post('/:id/hozzaszolas', authenticate, (req, res) => {
  const temaId = parseInt(req.params.id)
  const { content } = req.body

  if (!content) return res.status(400).json({ error: 'A tartalom kötelező.' })

  const [newComment] = db
    .insert(hozzaszolasok)
    .values({ temaId, content, userId: req.user.id, createdAt: new Date().toISOString() })
    .returning()
    .all()

  res.status(201).json(newComment)
})

// VÉDETT — bejelentkezett user szavazhat
router.patch('/:id/vote', authenticate, (req, res) => {
  const id = parseInt(req.params.id)
  const { delta } = req.body

  const tema = db.select().from(temak).where(eq(temak.id, id)).get()
  if (!tema) return res.status(404).json({ error: 'Téma nem található.' })

  const [updated] = db
    .update(temak)
    .set({ votes: tema.votes + (delta === 1 ? 1 : -1) })
    .where(eq(temak.id, id))
    .returning()
    .all()

  res.json(updated)
})

// VÉDETT — csak moderátor vagy admin törölhet bárki témáját
router.delete('/:id', authenticate, authorize('moderator', 'admin'), (req, res) => {
  const id = parseInt(req.params.id)

  const tema = db.select().from(temak).where(eq(temak.id, id)).get()
  if (!tema) return res.status(404).json({ error: 'Téma nem található.' })

  db.delete(hozzaszolasok).where(eq(hozzaszolasok.temaId, id)).run()
  db.delete(temak).where(eq(temak.id, id)).run()

  res.json({ ok: true })
})

module.exports = router
