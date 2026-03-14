const { pgTable, serial, text, integer } = require('drizzle-orm/pg-core')

const temak = pgTable('temak', {
  id:            serial('id').primaryKey(),
  userId:        integer('user_id').notNull(),
  title:         text('title').notNull(),
  content:       text('content').notNull(),
  category:      text('category').notNull(),
  categoryColor: text('category_color').notNull().default('#4ade80'),
  votes:         integer('votes').notNull().default(0),
  commentCount:  integer('comment_count').notNull().default(0),
  createdAt:     text('created_at').notNull(),
})

const hozzaszolasok = pgTable('hozzaszolasok', {
  id:        serial('id').primaryKey(),
  temaId:    integer('tema_id').notNull(),
  userId:    integer('user_id').notNull(),
  content:   text('content').notNull(),
  votes:     integer('votes').notNull().default(0),
  createdAt: text('created_at').notNull(),
})

module.exports = { temak, hozzaszolasok }
