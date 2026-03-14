const { pgTable, serial, text, integer } = require('drizzle-orm/pg-core')

const users = pgTable('users', {
  id:           serial('id').primaryKey(),
  username:     text('username').notNull().unique(),
  email:        text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role:         text('role').notNull().default('user'),
  level:        integer('level').notNull().default(1),
  points:       integer('points').notNull().default(0),
  avatarColor:  text('avatar_color').notNull().default('#4ade80'),
  createdAt:    text('created_at').notNull(),
})

module.exports = { users }
