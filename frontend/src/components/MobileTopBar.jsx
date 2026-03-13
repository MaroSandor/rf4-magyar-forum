import { Menu, Fish, Sun, Moon, LogIn, LogOut } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function MobileTopBar({ onMenuClick }) {
  const t = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: t.bgCard, borderBottom: `1px solid ${t.border}`,
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      padding: '0.75rem 1rem', flexShrink: 0,
    }}>
      <button onClick={onMenuClick} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', display: 'flex', padding: '2px' }}>
        <Menu size={20} />
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'linear-gradient(135deg, #22c55e, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Fish size={15} color="#fff" />
        </div>
        <span style={{ color: t.text, fontWeight: '700', fontSize: '0.88rem' }}>RF4 Magyar</span>
      </div>
      <div style={{ flex: 1 }} />
      <button onClick={t.toggle} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', display: 'flex', padding: '4px' }}>
        {t.isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      {user ? (
        <button onClick={async () => { await logout(); navigate('/login') }} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', display: 'flex', padding: '4px' }}>
          <LogOut size={18} />
        </button>
      ) : (
        <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', display: 'flex', padding: '4px' }}>
          <LogIn size={18} />
        </button>
      )}
    </div>
  )
}

export default MobileTopBar
