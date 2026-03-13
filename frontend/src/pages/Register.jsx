import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { api } from '../api'

function Register() {
  const { setUser } = useAuth()
  const t = useTheme()
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.password2) {
      setError('A két jelszó nem egyezik.')
      return
    }
    setLoading(true)
    try {
      const res = await api.auth.register({ username: form.username, email: form.email, password: form.password })
      setUser(res.user)
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
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.bg, minHeight: '100vh' }}>
      <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '2rem', width: '380px' }}>
        <h2 style={{ color: t.text, fontSize: '1.3rem', fontWeight: '700', marginBottom: '0.4rem' }}>Regisztráció</h2>
        <p style={{ color: t.textMuted, fontSize: '0.85rem', marginBottom: '1.5rem' }}>Csatlakozz az RF4 Magyar közösséghez!</p>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Felhasználónév</label>
          <input
            type="text"
            placeholder="horgász123"
            value={form.username}
            onChange={set('username')}
            required
            minLength={3}
            style={inputStyle}
          />

          <label style={labelStyle}>E-mail</label>
          <input
            type="email"
            placeholder="te@email.com"
            value={form.email}
            onChange={set('email')}
            required
            style={inputStyle}
          />

          <label style={labelStyle}>Jelszó</label>
          <input
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={set('password')}
            required
            minLength={6}
            style={inputStyle}
          />

          <label style={labelStyle}>Jelszó megerősítése</label>
          <input
            type="password"
            placeholder="••••••••"
            value={form.password2}
            onChange={set('password2')}
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
            {loading ? 'Regisztráció...' : 'Regisztráció'}
          </button>
        </form>

        <p style={{ color: t.textMuted, fontSize: '0.78rem', textAlign: 'center', marginTop: '1rem' }}>
          Már van fiókod?{' '}
          <Link to="/login" style={{ color: t.green, textDecoration: 'none' }}>Bejelentkezés</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
