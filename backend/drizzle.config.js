// drizzle.config.js — Drizzle Kit beállítások
// A drizzle-kit egy parancssori eszköz ami:
//  - Generálja az SQL migration fájlokat a sémád alapján
//  - Le tudja futtatni ezeket az adatbázison
//  - Van egy vizuális studio nézetje is (drizzle-kit studio)

/** @type {import('drizzle-kit').Config} */
module.exports = {
  // Hol találja a séma fájlokat
  schema: './src/db/schema/*.js',

  // Hova generálja a migration fájlokat
  out: './drizzle',

  // Milyen adatbázist használunk
  dialect: 'sqlite',

  // Az SQLite fájl elérési útja
  dbCredentials: {
    url: './rf4forum.db',
  },
}
