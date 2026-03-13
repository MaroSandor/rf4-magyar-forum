// Minden API hívás ezen a fájlon keresztül megy.
// Ha a backend URL változik, csak itt kell módosítani.

// Dev módban a Vite proxy irányítja /api → localhost:3001
// Production módban az Express ugyanazon az originen szolgálja ki
const BASE = '/api'

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',   // ← cookie-t elküldi minden kérésnél
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  // Témák
  temak: {
    getAll:      ()           => req('/temak'),
    getOne:      (id)         => req(`/temak/${id}`),
    create:      (data)       => req('/temak', { method: 'POST', body: JSON.stringify(data) }),
    vote:        (id, delta)  => req(`/temak/${id}/vote`, { method: 'PATCH', body: JSON.stringify({ delta }) }),
    hozzaszol:   (id, data)   => req(`/temak/${id}/hozzaszolas`, { method: 'POST', body: JSON.stringify(data) }),
  },

  // Fogások
  fogasok: {
    getAll:  ()          => req('/fogasok'),
    create:  (data)      => req('/fogasok', { method: 'POST', body: JSON.stringify(data) }),
    vote:    (id, delta) => req(`/fogasok/${id}/vote`, { method: 'PATCH', body: JSON.stringify({ delta }) }),
  },

  // Spotok
  spotok: {
    getAll: () => req('/spotok'),
    getOne: (id) => req(`/spotok/${id}`),
  },

  // Értesítések
  ertesitesek: {
    getAll:  (userId = 1) => req(`/ertesitesek?userId=${userId}`),
    readOne: (id)         => req(`/ertesitesek/${id}/read`, { method: 'PATCH' }),
    readAll: (userId = 1) => req(`/ertesitesek/read-all?userId=${userId}`, { method: 'PATCH' }),
    delete:  (id)         => req(`/ertesitesek/${id}`, { method: 'DELETE' }),
  },

  // Felhasználók
  users: {
    leaderboard: () => req('/users/leaderboard'),
    getOne:      (id) => req(`/users/${id}`),
  },

  // Autentikáció
  auth: {
    register: (data)  => req('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login:    (data)  => req('/auth/login',    { method: 'POST', body: JSON.stringify(data) }),
    logout:   ()      => req('/auth/logout',   { method: 'POST' }),
    me:       ()      => req('/auth/me'),
  },
}
