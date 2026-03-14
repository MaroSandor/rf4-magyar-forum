const { pgTable, serial, text, integer, doublePrecision } = require('drizzle-orm/pg-core')

const spotok = pgTable('spotok', {
  id:           serial('id').primaryKey(),
  nev:          text('nev').notNull(),
  regio:        text('regio').notNull(),
  leiras:       text('leiras'),
  nehezseg:     text('nehezseg').notNull().default('Kezdő'),
  nehezsegSzin: text('nehezseg_szin').notNull().default('#2d9c8a'),
  ertekeles:    doublePrecision('ertekeles').notNull().default(0),
  aktivFelh:    integer('aktiv_felh').notNull().default(0),
  halfajok:     text('halfajok').notNull().default('[]'),
  tags:         text('tags').notNull().default('[]'),
  createdAt:    text('created_at').notNull(),
})

module.exports = { spotok }
