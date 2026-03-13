import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Home, Bell, ChevronsLeft, ChevronsRight, Search, LogIn, LogOut, Fish, FileText, HelpCircle, MapPin, Sun, Moon, X, Settings, Shield, Star } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useIsMobile } from '../hooks/useIsMobile'

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

const avatarColors = ['#4ade80', '#2d9c8a', '#f87171', '#c8a87a', '#38bdf8', '#a78bfa']

const roleLabels = { user: 'Felhasználó', moderator: 'Moderátor', admin: 'Admin' }
const roleBadgeColor = { user: '#4ade80', moderator: '#38bdf8', admin: '#f87171' }

function AccountModal({ onClose }) {
  const t = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [selectedColor, setSelectedColor] = useState(user?.avatarColor || '#4ade80')

  if (!user) return null

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200 }} />
      <div style={{
        position: 'fixed', bottom: '5rem', left: '1rem', zIndex: 201,
        background: t.modalBg, border: `1px solid ${t.borderFocus}`,
        borderRadius: '14px', width: '280px', overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
      }}>
        {/* Header */}
        <div style={{ background: t.modalHeader, padding: '1.25rem', borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: selectedColor, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '1.1rem', border: `2px solid ${t.borderFocus}` }}>
            {user.username[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: t.text, fontWeight: '700', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.username}</div>
            <div style={{ color: t.textMuted, fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', display: 'flex' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '1rem' }}>
          {/* Role + stats */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ background: `${roleBadgeColor[user.role] || '#4ade80'}22`, color: roleBadgeColor[user.role] || '#4ade80', fontSize: '0.7rem', fontWeight: '700', padding: '0.2rem 0.6rem', borderRadius: '5px', border: `1px solid ${roleBadgeColor[user.role] || '#4ade80'}44` }}>
              {roleLabels[user.role] || user.role}
            </span>
            <span style={{ background: t.bgRaised, color: '#22c55e', fontSize: '0.7rem', fontWeight: '700', padding: '0.2rem 0.6rem', borderRadius: '5px' }}>
              {user.level}. SZINT
            </span>
            <span style={{ background: t.bgRaised, color: t.textSec, fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '5px' }}>
              {user.points} pont
            </span>
          </div>

          {/* Avatar color */}
          <p style={{ color: t.textDim, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', marginBottom: '0.4rem' }}>Avatar szín</p>
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
            {avatarColors.map((color) => (
              <button key={color} onClick={() => setSelectedColor(color)} style={{ width: '24px', height: '24px', borderRadius: '50%', background: color, border: selectedColor === color ? `2px solid ${t.text}` : `2px solid transparent`, cursor: 'pointer', padding: 0 }} />
            ))}
          </div>

          {/* Logout */}
          <button
            onClick={async () => { await logout(); navigate('/login'); onClose() }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#7f1d1d', color: '#fca5a5', border: '1px solid #991b1b', borderRadius: '8px', padding: '0.6rem', fontWeight: '600', fontSize: '0.83rem', cursor: 'pointer' }}
          >
            <LogOut size={14} /> Kijelentkezés
          </button>
        </div>
      </div>
    </>
  )
}

function Sidebar({ isMobile, isOpen, onClose }) {
  const [open, setOpen] = useState(true)
  const [search, setSearch] = useState('')
  const [showAccount, setShowAccount] = useState(false)
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

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/?q=${encodeURIComponent(search.trim())}`)
      if (isMobile && onClose) onClose()
    }
  }

  const sidebarWidth = isMobile ? '240px' : (open ? '220px' : '56px')

  const sidebarStyle = isMobile ? {
    position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100,
    width: '240px',
    transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.3s',
    background: t.bgCard, display: 'flex', flexDirection: 'column',
    borderRight: `1px solid ${t.border}`,
  } : {
    width: sidebarWidth, height: '100vh', position: 'sticky', top: 0,
    background: t.bgCard, transition: 'width 0.3s', overflow: 'hidden',
    display: 'flex', flexDirection: 'column', flexShrink: 0,
    borderRight: `1px solid ${t.border}`,
  }

  const isExpanded = isMobile ? true : open

  return (
    <>
      {showAccount && <AccountModal onClose={() => setShowAccount(false)} />}

      {/* Mobile backdrop */}
      {isMobile && isOpen && (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }} />
      )}

      <aside style={sidebarStyle}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 0.75rem', gap: '0.6rem', borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
          <div
            onClick={() => { if (!isMobile && !open) setOpen(true) }}
            style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #22c55e, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: (!isMobile && !open) ? 'pointer' : 'default' }}
          >
            <Fish size={18} color="#fff" />
          </div>
          {isExpanded && <span style={{ color: t.text, fontWeight: '700', fontSize: '0.9rem', whiteSpace: 'nowrap', flex: 1 }}>RF4 Magyar</span>}
          {isExpanded && !isMobile && (
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', display: 'flex' }}>
              <ChevronsLeft size={16} />
            </button>
          )}
          {isMobile && (
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', display: 'flex' }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Search */}
        {isExpanded && (
          <div style={{ padding: '0.75rem', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: t.bgRaised, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '0.45rem 0.75rem' }}>
              <Search size={13} color={t.textMuted} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Keresés... (Enter)"
                style={{ background: 'none', border: 'none', outline: 'none', color: t.textSec, fontSize: '0.82rem', width: '100%' }}
              />
            </div>
          </div>
        )}

        {/* Navigate */}
        <div style={{ padding: '0.25rem 0', overflowY: 'auto', flex: 1 }}>
          {isExpanded && <p style={{ color: t.textDim, fontSize: '0.68rem', padding: '0.4rem 1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' }}>Navigáció</p>}
          {navLinks.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'} style={navLinkStyle} onClick={isMobile ? onClose : undefined}>
              <Icon size={17} style={{ flexShrink: 0 }} />
              {isExpanded && <span style={{ whiteSpace: 'nowrap', fontSize: '0.88rem' }}>{label}</span>}
            </NavLink>
          ))}
          {user?.role === 'admin' && (
            <NavLink to="/admin" style={navLinkStyle} onClick={isMobile ? onClose : undefined}>
              <Shield size={17} style={{ flexShrink: 0 }} />
              {isExpanded && <span style={{ whiteSpace: 'nowrap', fontSize: '0.88rem', color: '#f87171' }}>Admin</span>}
            </NavLink>
          )}
        </div>

        {/* Bottom links */}
        <div style={{ padding: '0.25rem 0', borderTop: `1px solid ${t.border}`, flexShrink: 0 }}>
          {bottomLinks.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} style={navLinkStyle} onClick={isMobile ? onClose : undefined}>
              <Icon size={17} style={{ flexShrink: 0 }} />
              {isExpanded && <span style={{ whiteSpace: 'nowrap', fontSize: '0.88rem' }}>{label}</span>}
            </NavLink>
          ))}
        </div>

        {/* User Profile */}
        <div style={{ borderTop: `1px solid ${t.border}`, padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: user?.avatarColor || 'linear-gradient(135deg, #22c55e, #16a34a)',
            flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 'bold', fontSize: '0.8rem',
            cursor: user ? 'pointer' : 'default',
          }} onClick={() => user && setShowAccount(true)}>
            {user ? user.username[0].toUpperCase() : 'V'}
          </div>
          {isExpanded && (
            <>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ color: t.text, fontSize: '0.85rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user ? user.username : 'Vendég'}
                </div>
                <div style={{ color: '#22c55e', fontSize: '0.68rem', fontWeight: '600', letterSpacing: '0.05em' }}>
                  {user ? `${user.level}. SZINT` : 'Vendég'}
                </div>
              </div>
              {!isMobile && (
                <button onClick={t.toggle} title={t.isDark ? 'Világos mód' : 'Sötét mód'} style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', display: 'flex', padding: '2px' }}>
                  {t.isDark ? <Sun size={15} /> : <Moon size={15} />}
                </button>
              )}
              <button
                onClick={() => user ? setShowAccount(true) : navigate('/login')}
                title={user ? 'Fiók beállítások' : 'Bejelentkezés'}
                style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', display: 'flex', padding: '2px' }}
              >
                {user ? <Settings size={15} /> : <LogIn size={15} />}
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  )
}

export default Sidebar
