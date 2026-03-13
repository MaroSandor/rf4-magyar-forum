// Ez a fájl hozza létre az adatbázis kapcsolatot.
// better-sqlite3 egy szinkron SQLite driver — nincs async/await,
// ami egyszerűbbé teszi a használatát kis projekteknél.

const path = require('path')
const Database = require('better-sqlite3')
const { drizzle } = require('drizzle-orm/better-sqlite3')

// Az összes sémát importáljuk, hogy a Drizzle ismerje a táblákat
const { users } = require('./schema/users')
const { temak, hozzaszolasok } = require('./schema/temak')
const { fogasok } = require('./schema/fogasok')
const { spotok } = require('./schema/spotok')
const { ertesitesek } = require('./schema/ertesitesek')

// __dirname alapú abszolút út — működik akármelyik könyvtárból indítva
const sqlite = new Database(path.join(__dirname, '../../rf4forum.db'))

// WAL mód = Write-Ahead Logging — gyorsabb írás párhuzamos olvasás mellett
sqlite.pragma('journal_mode = WAL')
sqlite.pragma('foreign_keys = ON')

// A drizzle() becsomagolja a nyers sqlite kapcsolatot
// és ráaggatja a Drizzle query builder-t
const db = drizzle(sqlite, {
  schema: { users, temak, hozzaszolasok, fogasok, spotok, ertesitesek },
})

module.exports = { db, sqlite }
