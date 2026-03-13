const { sqliteTable, integer, text } = require('drizzle-orm/sqlite-core')

const ertesitesek = sqliteTable('ertesitesek', {
  id:        integer('id').primaryKey({ autoIncrement: true }),
  userId:    integer('user_id').notNull(),    // kinek szól az értesítés
  fromUserId: integer('from_user_id'),        // ki váltotta ki (lehet null, pl. rendszer üzenet)

  // 'reply' | 'like' | 'follow' | 'system'
  type:      text('type').notNull(),

  // Rövid szöveg pl. "válaszolt a hozzászólásodra:"
  text:      text('text').notNull(),

  // Opcionális részlet pl. az idézett bejegyzés
  detail:    text('detail'),

  // Olvasott-e már
  read:      integer('read').notNull().default(0), // SQLite-ban nincs boolean, 0=false, 1=true

  createdAt: text('created_at').notNull().default("(datetime('now'))"),
})

module.exports = { ertesitesek }
