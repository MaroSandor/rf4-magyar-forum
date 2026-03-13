import { useState, useEffect } from 'react'
import { MessageSquare, ThumbsUp, UserPlus, Bell, Trash2 } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { api } from '../api/index'

const initialNotifications = [
  {
    id: 1, type: 'reply', read: false,
    user: 'MesterHorgász', userColor: '#4ade80',
    text: 'válaszolt a hozzászólásodra:',
    detail: '"Szerintem a Svir folyón a legjobb helyek..."',
    time: '5 perce',
  },
  {
    id: 2, type: 'like', read: false,
    user: 'TapasztaltZoli', userColor: '#2d9c8a',
    text: 'kedvelte a bejegyzésedet:',
    detail: '"15kg-os harcsa a Ladogából!"',
    time: '23 perce',
  },
  {
    id: 3, type: 'follow', read: false,
    user: 'UjHorgász99', userColor: '#2d9c8a',
    text: 'követni kezdett téged.',
    detail: null,
    time: '1 órája',
  },
  {
    id: 4, type: 'reply', read: true,
    user: 'HorgászPéter', userColor: '#fb923c',
    text: 'válaszolt a hozzászólásodra:',
    detail: '"Én ezzel a bottal próbálkoztam..."',
    time: '3 órája',
  },
  {
    id: 5, type: 'like', read: true,
    user: 'RecordHunter', userColor: '#a78bfa',
    text: 'kedvelte a bejegyzésedet:',
    detail: '"Tippek kezdőknek a Volga-deltán"',
    time: '1 napja',
  },
  {
    id: 6, type: 'follow', read: true,
    user: 'NagyFogás', userColor: '#f87171',
    text: 'követni kezdett téged.',
    detail: null,
    time: '2 napja',
  },
]

const typeIcon = {
  reply: { icon: MessageSquare, color: '#4ade80' },
  like: { icon: ThumbsUp, color: '#2d9c8a' },
  follow: { icon: UserPlus, color: '#2d9c8a' },
}

function Ertesitesek() {
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('mind')
  const t = useTheme()

  useEffect(() => {
    api.ertesitesek.getAll(1).then((data) => setNotifications(data.map((n) => ({
      ...n,
      user: n.fromUserName || 'Rendszer',
      userColor: n.fromUserColor || '#64748b',
    }))))
  }, [])

  const markAllRead = () => {
    api.ertesitesek.readAll(1)
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteOne = (id) => {
    api.ertesitesek.delete(id)
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const filtered = notifications.filter((n) => {
    if (filter === 'olvasatlan') return !n.read
    return true
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div style={{ flex: 1, background: t.bg, minHeight: '100vh', padding: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Bell size={20} color="#4ade80" />
          <h1 style={{ color: t.text, fontSize: '1.3rem', fontWeight: '700', margin: 0 }}>Értesítések</h1>
          {unreadCount > 0 && (
            <span style={{ background: '#4ade80', color: '#0f172a', fontSize: '0.7rem', fontWeight: '700', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} style={{ background: 'none', border: `1px solid ${t.border}`, color: t.textMuted, borderRadius: '7px', padding: '0.4rem 0.9rem', fontSize: '0.78rem', cursor: 'pointer' }}>
            Mind olvasottnak jelöl
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {[{ key: 'mind', label: 'Mind' }, { key: 'olvasatlan', label: `Olvasatlan (${unreadCount})` }].map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)} style={{
            background: filter === key ? t.filterActiveBg : 'transparent',
            color: filter === key ? t.filterActiveColor : t.textMuted,
            border: '1px solid ' + (filter === key ? t.filterActiveBorder : t.border),
            borderRadius: '7px', padding: '0.35rem 0.9rem', fontSize: '0.8rem',
            fontWeight: filter === key ? '600' : '400', cursor: 'pointer',
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ maxWidth: '680px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: t.textDim }}>
            <Bell size={32} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
            <p>Nincs olvasatlan értesítésed.</p>
          </div>
        ) : (
          filtered.map((n) => {
            const { icon: Icon, color } = typeIcon[n.type]
            return (
              <div key={n.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.875rem',
                padding: '0.875rem 1rem', marginBottom: '0.4rem',
                background: n.read ? t.bgCard : t.unreadBg,
                borderRadius: '10px', border: '1px solid ' + (n.read ? t.border : t.unreadBorder),
                position: 'relative',
              }}>
                {!n.read && (
                  <div style={{ position: 'absolute', left: '-1px', top: '50%', transform: 'translateY(-50%)', width: '3px', height: '60%', background: '#4ade80', borderRadius: '0 3px 3px 0' }} />
                )}

                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: n.userColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111', fontWeight: '700', fontSize: '0.82rem' }}>
                    {n.user[0]}
                  </div>
                  <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '16px', height: '16px', borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${n.read ? t.bgCard : t.unreadBg}` }}>
                    <Icon size={8} color="#111" />
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: t.text, fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                    <strong style={{ color: n.userColor }}>{n.user}</strong>{' '}
                    <span style={{ color: t.textSec }}>{n.text}</span>
                  </p>
                  {n.detail && (
                    <p style={{ color: t.textMuted, fontSize: '0.78rem', margin: '0.2rem 0 0', fontStyle: 'italic' }}>{n.detail}</p>
                  )}
                  <p style={{ color: t.textDim, fontSize: '0.72rem', margin: '0.3rem 0 0' }}>{n.time}</p>
                </div>

                <button onClick={() => deleteOne(n.id)} style={{ background: 'none', border: 'none', color: t.textDim, cursor: 'pointer', padding: '4px', borderRadius: '6px', display: 'flex', flexShrink: 0 }}>
                  <Trash2 size={14} />
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Ertesitesek
