const express = require('express')
const { eq, desc } = require('drizzle-orm')
const { db } = require('../db/index')
const { temak, hozzaszolasok } = require('../db/schema/temak')
const { users } = require('../db/schema/users')
const { authenticate } = require('../middleware/authenticate')
const { authorize } = require('../middleware/authorize')

const router = express.Router()

// NYILVÁNOS
router.get('/', async (req, res) => {
  const result = await db
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

  res.json(result)
})

// NYILVÁNOS
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id)

  const tema = (await db
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
    .where(eq(temak.id, id)))[0]

  if (!tema) return res.status(404).json({ error: 'Téma nem található.' })

  const comments = await db
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

  res.json({ ...tema, comments })
})

// VÉDETT
router.post('/', authenticate, async (req, res) => {
  const { title, content, category, categoryColor } = req.body

  if (!title || !content || !category) {
    return res.status(400).json({ error: 'Cím, tartalom és kategória kötelező.' })
  }

  const [newTema] = await db
    .insert(temak)
    .values({
      title, content, category,
      categoryColor: categoryColor || '#4ade80',
      userId: req.user.id,
      createdAt: new Date().toISOString(),
    })
    .returning()

  res.status(201).json(newTema)
})

// VÉDETT
router.post('/:id/hozzaszolas', authenticate, async (req, res) => {
  const temaId = parseInt(req.params.id)
  const { content } = req.body

  if (!content) return res.status(400).json({ error: 'A tartalom kötelező.' })

  const [newComment] = await db
    .insert(hozzaszolasok)
    .values({ temaId, content, userId: req.user.id, createdAt: new Date().toISOString() })
    .returning()

  res.status(201).json(newComment)
})

// VÉDETT
router.patch('/:id/vote', authenticate, async (req, res) => {
  const id = parseInt(req.params.id)
  const { delta } = req.body

  const tema = (await db.select().from(temak).where(eq(temak.id, id)))[0]
  if (!tema) return res.status(404).json({ error: 'Téma nem található.' })

  const [updated] = await db
    .update(temak)
    .set({ votes: tema.votes + (delta === 1 ? 1 : -1) })
    .where(eq(temak.id, id))
    .returning()

  res.json(updated)
})

// VÉDETT — csak moderátor vagy admin
router.delete('/:id', authenticate, authorize('moderator', 'admin'), async (req, res) => {
  const id = parseInt(req.params.id)

  const tema = (await db.select().from(temak).where(eq(temak.id, id)))[0]
  if (!tema) return res.status(404).json({ error: 'Téma nem található.' })

  await db.delete(hozzaszolasok).where(eq(hozzaszolasok.temaId, id))
  await db.delete(temak).where(eq(temak.id, id))

  res.json({ ok: true })
})

module.exports = router
