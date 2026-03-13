require('dotenv').config({ path: require('path').join(__dirname, '.env') })
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3001
const isProd = process.env.NODE_ENV === 'production'

app.use(cookieParser())

// Development módban a Vite dev szerver külön fut (5173-as porton),
// ezért CORS-t kell engedélyezni. Production módban az Express maga
// szolgálja ki a frontend buildet, nincs szükség CORS-ra.
if (!isProd) {
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }))
}

app.use(express.json())

// API route-ok — ezek mindig előbb jönnek a statikus fájlkiszolgálásnál
app.use('/api/auth',        require('./src/routes/auth'))
app.use('/api/temak',       require('./src/routes/temak'))
app.use('/api/fogasok',     require('./src/routes/fogasok'))
app.use('/api/spotok',      require('./src/routes/spotok'))
app.use('/api/ertesitesek', require('./src/routes/ertesitesek'))
app.use('/api/users',       require('./src/routes/users'))

if (isProd) {
  // Production: az Express statikusan kiszolgálja a Vite által épített frontendet.
  // A 'public' mappa a frontend build kimenet (vite.config.js: outDir).
  const publicDir = path.join(__dirname, 'public')
  app.use(express.static(publicDir))

  // SPA catch-all: minden egyéb kérésre az index.html-t adjuk vissza,
  // hogy a React Router kezelje a kliensoldali útvonalakat.
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'))
  })
} else {
  // Development: csak az API fut, a frontend a Vite dev szerveren van
  app.get('/', (req, res) => {
    res.json({ message: 'RF4 Magyar Fórum API', version: '1.0' })
  })

  app.use((req, res) => {
    res.status(404).json({ error: `Nem található: ${req.method} ${req.path}` })
  })
}

app.listen(PORT, () => {
  const mode = isProd ? 'PRODUCTION' : 'DEVELOPMENT'
  console.log(`[${mode}] API fut: http://localhost:${PORT}`)
  if (isProd) {
    console.log(`[PRODUCTION] Frontend: http://localhost:${PORT}`)
  }
})
