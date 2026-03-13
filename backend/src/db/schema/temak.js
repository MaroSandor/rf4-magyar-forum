const { sqliteTable, integer, text } = require('drizzle-orm/sqlite-core')

// Ez a tábla tárolja a fórum témákat (discussion threads)
const temak = sqliteTable('temak', {
  id:            integer('id').primaryKey({ autoIncrement: true }),

  // Idegen kulcs (foreign key) — melyik user írta
  // A references() megmondja Drizzle-nek hogy ez egy kapcsolat másik táblához
  userId:        integer('user_id').notNull(),

  title:         text('title').notNull(),
  content:       text('content').notNull(),
  category:      text('category').notNull(), // 'Horgászhelyek' | 'Felszerelések' | stb.
  categoryColor: text('category_color').notNull().default('#4ade80'),

  votes:         integer('votes').notNull().default(0),
  commentCount:  integer('comment_count').notNull().default(0),

  createdAt:     text('created_at').notNull().default("(datetime('now'))"),
})

// Hozzászólások táblája — a témákhoz tartozó válaszok
const hozzaszolasok = sqliteTable('hozzaszolasok', {
  id:        integer('id').primaryKey({ autoIncrement: true }),
  temaId:    integer('tema_id').notNull(),    // melyik témához tartozik
  userId:    integer('user_id').notNull(),    // ki írta
  content:   text('content').notNull(),
  votes:     integer('votes').notNull().default(0),
  createdAt: text('created_at').notNull().default("(datetime('now'))"),
})

module.exports = { temak, hozzaszolasok }
