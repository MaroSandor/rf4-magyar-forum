import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],

  // Dev módban az /api kéréseket átirányítja a backend szerverre.
  // Így a frontend kódban mindig /api-t használunk, nem http://localhost:3001-et.
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        // cookie-kat is átenged (auth)
        cookieDomainRewrite: 'localhost',
      },
    },
  },

  // Production build kimenete a backend/public mappába kerül,
  // ahonnan az Express statikusan kiszolgálja.
  build: {
    outDir: path.resolve(__dirname, '../backend/public'),
    emptyOutDir: true,
  },
})
