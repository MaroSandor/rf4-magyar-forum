import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Home, Bell, ChevronsLeft, ChevronsRight, Search, LogIn, LogOut, Fish, FileText, HelpCircle, MapPin, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { to: '/', icon: Home, label: 'Főoldal' },
  { to: '/fogasok', icon: Fish, label: 'Fogások' },
  { to: '/spotok', icon: MapPin, label: 'Spotok' },
  { to: '/notifications', icon: Bell, label: 'Értesítések' },
]

const bottomLinks = [
  { to: '/rules', icon: FileText, label: 'Szabályzat' },
  { to: '/help', icon: HelpCircle, label: 'Segítség' },
]

function Sidebar() {
  const [open, setOpen] = useState(true)
  const t = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    color: isActive ? t.navActiveColor : t.textMuted,
    padding: '0.55rem 0.75rem',
    textDecoration: 'none',
    borderRadius: '8px',
    margin: '2px 0.5rem',
    background: isActive ? t.navActiveBg : 'transparent',
    border: `1px solid ${isActive ? t.navActiveBorder : 'transparent'}`,
    transition: 'background 0.15s, color 0.15s',
  })

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  // Felhasználói avatar betűjele és színe
  const avatarLetter = user ? user.username[0].toUpperCase() : 'V'
  const avatarColor = user?.avatarColor || 'linear-gradient(135deg, #22c55e, #16a34a)'
  const displayName = user ? user.username : 'Vendég'
  const levelLabel = user ? `${user.level}. SZINT` : 'Vendég'

  return (
    <aside style={{
      width: open ? '220px' : '56px', height: '100vh', position: 'sticky', top: 0,
      background: t.bgCard, transition: 'width 0.3s', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
      borderRight: `1px solid ${t.border}`
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 0.75rem', gap: '0.6rem', borderBottom: `1px solid ${t.border}` }}>
        <div
          onClick={() => !open && setOpen(true)}
          style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #22c55e, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: open ? 'default' : 'pointer' }}
        >
          <Fish size={18} color="#fff" />
        </div>
        {open && <span style={{ color: t.text, fontWeight: '700', fontSize: '0.9rem', whiteSpace: 'nowrap', flex: 1 }}>RF4 Magyar</span>}
        {open && (
          <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', display: 'flex' }}>
            <ChevronsLeft size={16} />
          </button>
        )}
      </div>

      {/* Search */}
      {open && (
        <div style={{ padding: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: t.bgRaised, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '0.45rem 0.75rem' }}>
            <Search size={13} color={t.textMuted} />
            <input placeholder="Keresés..." style={{ background: 'none', border: 'none', outline: 'none', color: t.textSec, fontSize: '0.82rem', width: '100%' }} />
          </div>
        </div>
      )}

      {/* Navigate */}
      <div style={{ padding: '0.25rem 0' }}>
        {open && <p style={{ color: t.textDim, fontSize: '0.68rem', padding: '0.4rem 1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' }}>Navigáció</p>}
        {navLinks.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'} style={navLinkStyle}>
            <Icon size={17} style={{ flexShrink: 0 }} />
            {open && <span style={{ whiteSpace: 'nowrap', fontSize: '0.88rem' }}>{label}</span>}
          </NavLink>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* Bottom links */}
      <div style={{ padding: '0.25rem 0', borderTop: `1px solid ${t.border}` }}>
        {bottomLinks.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} style={navLinkStyle}>
            <Icon size={17} style={{ flexShrink: 0 }} />
            {open && <span style={{ whiteSpace: 'nowrap', fontSize: '0.88rem' }}>{label}</span>}
          </NavLink>
        ))}
      </div>

      {/* User Profile */}
      <div style={{ borderTop: `1px solid ${t.border}`, padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: avatarColor,
          flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 'bold', fontSize: '0.8rem'
        }}>
          {avatarLetter}
        </div>
        {open && (
          <>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ color: t.text, fontSize: '0.85rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</div>
              <div style={{ color: '#22c55e', fontSize: '0.68rem', fontWeight: '600', letterSpacing: '0.05em' }}>{levelLabel}</div>
            </div>
            <button
              onClick={t.toggle}
              title={t.isDark ? 'Világos mód' : 'Sötét mód'}
              style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', display: 'flex', padding: '2px' }}
            >
              {t.isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            {user ? (
              <button
                onClick={handleLogout}
                title="Kijelentkezés"
                style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', display: 'flex', padding: '2px' }}
              >
                <LogOut size={15} />
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                title="Bejelentkezés"
                style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', display: 'flex', padding: '2px' }}
              >
                <LogIn size={15} />
              </button>
            )}
          </>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
