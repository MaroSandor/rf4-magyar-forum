import { useState, useEffect } from 'react'
import { Shield, Trash2, Users, Fish, MessageSquare, MapPin, RefreshCw } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { api } from '../api'

function Admin() {
  const t = useTheme()
  const { user } = useAuth()
  const [temak, setTemak] = useState([])
  const [fogasok, setFogasok] = useState([])
  const [users, setUsers] = useState([])
  const [spotok, setSpotok] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('temak')

  useEffect(() => {
    Promise.all([
      api.temak.getAll(),
      api.fogasok.getAll(),
      api.users.leaderboard(),
      api.spotok.getAll(),
    ]).then(([t, f, u, s]) => {
      setTemak(t)
      setFogasok(f)
      setUsers(u)
      setSpotok(s)
    }).finally(() => setLoading(false))
  }, [])

  async function deleteTema(id) {
    if (!confirm('Biztosan törlöd ezt a témát?')) return
    try {
      await api.temak.delete(id)
      setTemak(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  async function deleteFogas(id) {
    if (!confirm('Biztosan törlöd ezt a fogást?')) return
    try {
      await fetch(`/api/fogasok/${id}`, { method: 'DELETE', credentials: 'include' })
      setFogasok(prev => prev.filter(f => f.id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  const stats = [
    { icon: MessageSquare, label: 'Témák', value: temak.length, color: '#4ade80' },
    { icon: Fish, label: 'Fogások', value: fogasok.length, color: '#2d9c8a' },
    { icon: Users, label: 'Felhasználók', value: users.length, color: '#38bdf8' },
    { icon: MapPin, label: 'Spotok', value: spotok.length, color: '#c8a87a' },
  ]

  const tabs = ['temak', 'fogasok', 'felhasznalok']
  const tabLabels = { temak: 'Témák', fogasok: 'Fogások', felhasznalok: 'Felhasználók' }

  return (
    <div style={{ flex: 1, background: t.bg, minHeight: '100vh', padding: '2rem', maxWidth: '1000px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
        <Shield size={22} color="#f87171" />
        <h1 style={{ color: t.text, fontSize: '1.3rem', fontWeight: '700', margin: 0 }}>Admin Dashboard</h1>
      </div>
      <p style={{ color: t.textMuted, fontSize: '0.85rem', marginBottom: '1.5rem' }}>Bejelentkezett: <span style={{ color: '#f87171', fontWeight: '600' }}>{user?.username}</span></p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={20} color={color} />
            </div>
            <div>
              <div style={{ color: t.text, fontSize: '1.4rem', fontWeight: '800' }}>{loading ? '—' : value}</div>
              <div style={{ color: t.textMuted, fontSize: '0.75rem' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', borderBottom: `1px solid ${t.border}`, paddingBottom: '0' }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: activeTab === tab ? '#f87171' : t.textMuted,
            padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: activeTab === tab ? '600' : '400',
            borderBottom: activeTab === tab ? '2px solid #f87171' : '2px solid transparent',
            marginBottom: '-1px',
          }}>
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', color: t.textMuted, padding: '2rem' }}>Betöltés...</div>
      ) : (
        <>
          {/* Témák */}
          {activeTab === 'temak' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {temak.map(tema => (
                <div key={tema.id} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: t.text, fontSize: '0.88rem', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tema.title}</div>
                    <div style={{ color: t.textMuted, fontSize: '0.73rem', marginTop: '0.2rem' }}>
                      <span style={{ background: `${tema.categoryColor}22`, color: tema.categoryColor, padding: '0.1rem 0.4rem', borderRadius: '4px', marginRight: '0.5rem' }}>{tema.category}</span>
                      {tema.authorName} · {tema.votes} szavazat · {tema.commentCount} hsz
                    </div>
                  </div>
                  <button onClick={() => deleteTema(tema.id)} style={{ background: '#7f1d1d', border: '1px solid #991b1b', borderRadius: '6px', color: '#fca5a5', cursor: 'pointer', padding: '0.4rem', display: 'flex' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Fogások */}
          {activeTab === 'fogasok' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {fogasok.map(fogas => (
                <div key={fogas.id} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: t.text, fontSize: '0.88rem', fontWeight: '500' }}>{fogas.halfaj} — <span style={{ color: '#4ade80' }}>{fogas.suly} kg</span></div>
                    <div style={{ color: t.textMuted, fontSize: '0.73rem', marginTop: '0.2rem' }}>{fogas.authorName} · {fogas.spot} · {fogas.votes} szavazat</div>
                  </div>
                  <button onClick={() => deleteFogas(fogas.id)} style={{ background: '#7f1d1d', border: '1px solid #991b1b', borderRadius: '6px', color: '#fca5a5', cursor: 'pointer', padding: '0.4rem', display: 'flex' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Felhasználók */}
          {activeTab === 'felhasznalok' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {users.map((u, i) => (
                <div key={u.id} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: t.textDim, fontSize: '0.8rem', fontWeight: '700', width: '20px', textAlign: 'center' }}>#{i+1}</span>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: u.avatarColor || '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '0.8rem', flexShrink: 0 }}>
                    {u.username[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: t.text, fontSize: '0.88rem', fontWeight: '600' }}>{u.username}</div>
                    <div style={{ color: t.textMuted, fontSize: '0.73rem' }}>{u.level}. szint · {u.points} pont</div>
                  </div>
                  <span style={{
                    background: u.role === 'admin' ? '#f8717122' : u.role === 'moderator' ? '#38bdf822' : t.bgRaised,
                    color: u.role === 'admin' ? '#f87171' : u.role === 'moderator' ? '#38bdf8' : t.textMuted,
                    fontSize: '0.7rem', fontWeight: '600', padding: '0.2rem 0.6rem', borderRadius: '5px'
                  }}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Admin
