import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f172a', minHeight: '100vh', gap: '1rem' }}>
      <h1 style={{ color: '#4ade80', fontSize: '4rem', fontWeight: '800', margin: 0 }}>404</h1>
      <p style={{ color: '#f8fafc', fontSize: '1.1rem' }}>Az oldal nem található.</p>
      <Link to="/" style={{ color: '#4ade80', fontSize: '0.88rem', textDecoration: 'none', border: '1px solid #1e3a5f', padding: '0.5rem 1.25rem', borderRadius: '8px' }}>
        ← Vissza a főoldalra
      </Link>
    </div>
  )
}

export default NotFound
