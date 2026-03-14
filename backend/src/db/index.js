const { neon } = require('@neondatabase/serverless')
const { drizzle } = require('drizzle-orm/neon-http')

const { users } = require('./schema/users')
const { temak, hozzaszolasok } = require('./schema/temak')
const { fogasok } = require('./schema/fogasok')
const { spotok } = require('./schema/spotok')
const { ertesitesek } = require('./schema/ertesitesek')

const sql = neon(process.env.DATABASE_URL)
const db = drizzle(sql, {
  schema: { users, temak, hozzaszolasok, fogasok, spotok, ertesitesek },
})

module.exports = { db }
