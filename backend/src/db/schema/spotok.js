const { sqliteTable, integer, text, real } = require('drizzle-orm/sqlite-core')

const spotok = sqliteTable('spotok', {
  id:            integer('id').primaryKey({ autoIncrement: true }),
  nev:           text('nev').notNull(),
  regio:         text('regio').notNull(),
  leiras:        text('leiras'),
  nehezseg:      text('nehezseg').notNull().default('Kezdő'), // 'Kezdő' | 'Közepes' | 'Haladó'
  nehezsegSzin:  text('nehezseg_szin').notNull().default('#2d9c8a'),

  // Értékelés és aktív felhasználók
  ertekeles:     real('ertekeles').notNull().default(0),
  aktivFelh:     integer('aktiv_felh').notNull().default(0),

  // Halfajok JSON tömbként: '["Harcsa","Csuka","Ponty"]'
  halfajok:      text('halfajok').notNull().default('[]'),

  // Kategória-szerű szűrők JSON tömbként
  tags:          text('tags').notNull().default('[]'),

  createdAt:     text('created_at').notNull().default("(datetime('now'))"),
})

module.exports = { spotok }
