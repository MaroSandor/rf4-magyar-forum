const { sqliteTable, integer, text, real } = require('drizzle-orm/sqlite-core')

// real() = lebegőpontos szám (pl. 12.5 kg) — ezt SQLite REAL típusként tárolja
const fogasok = sqliteTable('fogasok', {
  id:        integer('id').primaryKey({ autoIncrement: true }),
  userId:    integer('user_id').notNull(),

  halfaj:    text('halfaj').notNull(),
  suly:      real('suly').notNull(),        // kg — real() mert tizedes is lehet
  hossz:     real('hossz'),                 // cm — opcionális, ezért nincs notNull()
  spot:      text('spot'),
  csali:     text('csali'),
  melyseg:   real('melyseg'),               // méter
  idojaras:  text('idojaras'),              // 'Napos' | 'Felhős' | 'Borult' | 'Szeles'
  fogasIdeje: text('fogas_ideje'),          // mikor fogták
  leiras:    text('leiras'),
  tags:      text('tags'),                  // JSON string-ként tároljuk: '["rekord","harcsa"]'

  votes:     integer('votes').notNull().default(0),
  createdAt: text('created_at').notNull().default("(datetime('now'))"),
})

module.exports = { fogasok }
