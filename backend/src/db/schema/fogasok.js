const { pgTable, serial, text, integer, doublePrecision } = require('drizzle-orm/pg-core')

const fogasok = pgTable('fogasok', {
  id:          serial('id').primaryKey(),
  userId:      integer('user_id').notNull(),
  halfaj:      text('halfaj').notNull(),
  suly:        doublePrecision('suly').notNull(),
  hossz:       doublePrecision('hossz'),
  spot:        text('spot'),
  csali:       text('csali'),
  melyseg:     doublePrecision('melyseg'),
  idojaras:    text('idojaras'),
  fogasIdeje:  text('fogas_ideje'),
  leiras:      text('leiras'),
  tags:        text('tags'),
  votes:       integer('votes').notNull().default(0),
  createdAt:   text('created_at').notNull(),
})

module.exports = { fogasok }
