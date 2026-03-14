const { pgTable, serial, text, integer } = require('drizzle-orm/pg-core')

const ertesitesek = pgTable('ertesitesek', {
  id:         serial('id').primaryKey(),
  userId:     integer('user_id').notNull(),
  fromUserId: integer('from_user_id'),
  type:       text('type').notNull(),
  text:       text('text').notNull(),
  detail:     text('detail'),
  read:       integer('read').notNull().default(0),
  createdAt:  text('created_at').notNull(),
})

module.exports = { ertesitesek }
