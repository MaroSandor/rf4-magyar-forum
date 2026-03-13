// A Drizzle-ben minden tábla egy JavaScript objektum.
// Az sqliteTable() első argumentuma a tábla neve az adatbázisban,
// a második egy objektum ahol minden kulcs egy oszlop.

const { sqliteTable, integer, text } = require('drizzle-orm/sqlite-core')

const users = sqliteTable('users', {
  // integer().primaryKey({ autoIncrement: true }) = auto-növekvő egyedi azonosító
  id:           integer('id').primaryKey({ autoIncrement: true }),

  // text().notNull() = kötelező szöveges mező
  username:     text('username').notNull().unique(),
  email:        text('email').notNull().unique(),

  // A jelszót soha nem tároljuk plain text-ben — bcrypt hash lesz
  passwordHash: text('password_hash').notNull(),

  // .default() = ha nem adunk meg értéket, ez lesz az alapértelmezett
  role:         text('role').notNull().default('user'), // 'user' | 'moderator' | 'admin'
  level:        integer('level').notNull().default(1),
  points:       integer('points').notNull().default(0),
  avatarColor:  text('avatar_color').notNull().default('#4ade80'),

  // Időbélyegek — ISO string formátumban tároljuk SQLite-ban
  createdAt:    text('created_at').notNull().default("(datetime('now'))"),
})

module.exports = { users }
