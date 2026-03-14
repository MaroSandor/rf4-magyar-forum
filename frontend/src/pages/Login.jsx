import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

function Login() {
  const { login } = useAuth()
  const t = useTheme()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email, password })
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', background: t.bgRaised, border: `1px solid ${t.border}`,
    borderRadius: '8px', padding: '0.6rem 0.75rem', color: t.text,
    fontSize: '0.88rem', outline: 'none', marginBottom: '1rem', boxSizing: 'border-box',
  }
  const labelStyle = { color: t.textMuted, fontSize: '0.78rem', fontWeight: '600', display: 'block', marginBottom: '0.3rem' }

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.bg, overflowY: 'auto', padding: '1rem' }}>
      <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '360px', boxSizing: 'border-box' }}>
        <h2 style={{ color: t.text, fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.4rem' }}>Bejelentkezés</h2>
        <p style={{ color: t.textMuted, fontSize: '0.85rem', marginBottom: '1.5rem' }}>Üdv vissza!</p>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>E-mail</label>
          <input
            type="email"
            placeholder="te@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <label style={labelStyle}>Jelszó</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ ...inputStyle, marginBottom: '1.5rem' }}
          />

          {error && (
            <div style={{ background: '#7f1d1d', border: '1px solid #991b1b', borderRadius: '8px', padding: '0.6rem 0.75rem', color: '#fca5a5', fontSize: '0.83rem', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.65rem', fontWeight: '600', fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Bejelentkezés...' : 'Bejelentkezés'}
          </button>
        </form>

        <p style={{ color: t.textMuted, fontSize: '0.78rem', textAlign: 'center', marginTop: '1rem' }}>
          Még nincs fiókod?{' '}
          <Link to="/register" style={{ color: t.green, textDecoration: 'none' }}>Regisztráció</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
