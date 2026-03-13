import { useState, useEffect } from 'react'
import { MessageSquare, Share2, Bookmark, ChevronUp, ChevronDown, Users, TrendingUp, X, PenLine } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/index'

const tabs = ['Felfedezés', 'Verseny', 'Gyakorlás', 'Tanulás', 'Közösség']

const discussions = [
  {
    id: 1, votes: 25, category: 'Horgászhelyek', categoryColor: '#4ade80',
    title: 'Hol érdemes mostanában a Ladogán horgászni?',
    author: 'MesterHorgász', time: '2 napja', comments: 24,
    avatars: ['#4ade80', '#2d9c8a', '#c8a87a'],
  },
  {
    id: 2, votes: 21, category: 'Felszerelések', categoryColor: '#2d9c8a',
    title: 'Teljesen megéri a prémium csali — 3 hetes teszt eredményei',
    author: 'TapasztaltZoli', time: '2 napja', comments: 32,
    avatars: ['#c8621a', '#8a6d2d', '#2d9c8a'],
  },
  {
    id: 3, votes: 22, category: 'Tanácsok', categoryColor: '#c8a87a',
    title: 'Ezeket a helyeket kerüljétek el tavasszal ;(',
    author: 'UjHorgász99', time: '3 napja', comments: 18,
    avatars: ['#4ade80', '#2d9c8a', '#c8a87a'],
  },
  {
    id: 4, votes: 38, category: 'Fogások', categoryColor: '#8ab84d',
    title: '15kg-os harcsa a Svirből — képekkel!',
    author: 'NagyFogás', time: '1 napja', comments: 55,
    avatars: ['#4ade80', '#8ab84d', '#2d9c8a'],
  },
]

const lobbies = [
  { id: 1, name: '#általános', desc: 'Általános horgász témák', users: 16 },
  { id: 2, name: '#csapat-keresés', desc: 'Keress horgász társat!', users: 27 },
  { id: 3, name: '#fogások', desc: 'Mutasd a mai fogásod!', users: 21 },
  { id: 4, name: '#kezdőknek', desc: 'Kérdezz bátran!', users: 14 },
]

const categoryOptions = [
  { label: 'Horgászhelyek', color: '#4ade80' },
  { label: 'Felszerelések', color: '#2d9c8a' },
  { label: 'Tanácsok', color: '#c8a87a' },
  { label: 'Fogások', color: '#8ab84d' },
  { label: 'Kérdések', color: '#38bdf8' },
  { label: 'Egyéb', color: '#a78bfa' },
]

const modalStyles = `
  @keyframes backdropIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes cardIn {
    from { opacity: 0; transform: scale(0.88) translateY(24px); }
    60%  { transform: scale(1.02) translateY(-4px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes borderGlow {
    0%   { box-shadow: 0 0 0px rgba(34,197,94,0); }
    50%  { box-shadow: 0 0 32px rgba(34,197,94,0.3); }
    100% { box-shadow: 0 25px 60px rgba(0,0,0,0.4); }
  }
`

function NewTopicModal({ onClose, onSubmit }) {
  const t = useTheme()
  const [form, setForm] = useState({ title: '', category: 'Horgászhelyek', content: '' })

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const inputStyle = {
    width: '100%', background: t.modalDetailBg, border: `1px solid ${t.border}`,
    borderRadius: '8px', padding: '0.6rem 0.75rem', color: t.text,
    fontSize: '0.83rem', outline: 'none', boxSizing: 'border-box',
  }
  const labelStyle = {
    color: t.textMuted, fontSize: '0.72rem', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.3rem',
  }

  const selectedCat = categoryOptions.find((c) => c.label === form.category)

  const handleSubmit = () => {
    if (!form.title.trim()) return
    onSubmit({
      title: form.title.trim(),
      content: form.content.trim(),
      category: form.category,
      categoryColor: selectedCat?.color || '#4ade80',
    })
    onClose()
  }

  return (
    <>
      <style>{modalStyles}</style>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem', animation: 'backdropIn 0.2s ease' }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ background: t.modalBg, border: `1px solid ${t.borderFocus}`, borderRadius: '16px', width: '100%', maxWidth: '540px', overflow: 'hidden', animation: 'cardIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both, borderGlow 0.6s ease forwards', display: 'flex', flexDirection: 'column' }}
        >
          {/* Header */}
          <div style={{ background: t.modalHeader, padding: '1.25rem 1.5rem', borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PenLine size={17} color="#fff" />
              </div>
              <div>
                <h2 style={{ color: t.text, fontSize: '1rem', fontWeight: '700', margin: 0 }}>Új téma nyitása</h2>
                <p style={{ color: t.textMuted, fontSize: '0.75rem', margin: 0 }}>Oszd meg gondolataidat a közösséggel</p>
              </div>
            </div>
            <button onClick={onClose} style={{ background: t.navActiveBg, border: `1px solid ${t.navActiveBorder}`, borderRadius: '6px', color: t.textSec, cursor: 'pointer', padding: '4px', display: 'flex' }}>
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Cím */}
            <div>
              <label style={labelStyle}>Cím *</label>
              <input
                value={form.title}
                onChange={set('title')}
                placeholder="Adj meg egy informatív, tömör címet..."
                style={{ ...inputStyle, fontSize: '0.9rem', fontWeight: '500' }}
              />
            </div>

            {/* Kategória */}
            <div>
              <label style={labelStyle}>Kategória</label>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {categoryOptions.map(({ label, color }) => (
                  <button
                    key={label}
                    onClick={() => setForm((f) => ({ ...f, category: label }))}
                    style={{
                      background: form.category === label ? `${color}22` : t.modalDetailBg,
                      color: form.category === label ? color : t.textMuted,
                      border: `1px solid ${form.category === label ? color : t.border}`,
                      borderRadius: '6px', padding: '0.3rem 0.75rem',
                      fontSize: '0.78rem', fontWeight: form.category === label ? '600' : '400',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tartalom */}
            <div>
              <label style={labelStyle}>Tartalom</label>
              <textarea
                value={form.content}
                onChange={set('content')}
                placeholder="Írd le részletesen a témádat, kérdésedet vagy tapasztalataidat..."
                rows={5}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.65 }}
              />
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '1rem 1.5rem', borderTop: `1px solid ${t.border}`, display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{ background: 'none', border: `1px solid ${t.border}`, color: t.textSec, borderRadius: '8px', padding: '0.55rem 1.25rem', fontSize: '0.83rem', cursor: 'pointer' }}>
              Mégse
            </button>
            <button onClick={handleSubmit} style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.55rem 1.5rem', fontSize: '0.83rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <PenLine size={14} /> Téma közzététele
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function VoteButton({ count }) {
  const [vote, setVote] = useState(0)
  const t = useTheme()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', minWidth: '32px' }}>
      <button onClick={() => setVote(vote === 1 ? 0 : 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: vote === 1 ? '#4ade80' : t.textDim, padding: '2px', borderRadius: '4px', display: 'flex' }}>
        <ChevronUp size={15} />
      </button>
      <span style={{ color: vote === 1 ? '#4ade80' : vote === -1 ? '#c0392b' : t.textSec, fontSize: '0.82rem', fontWeight: '700' }}>{count + vote}</span>
      <button onClick={() => setVote(vote === -1 ? 0 : -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: vote === -1 ? '#c0392b' : t.textDim, padding: '2px', borderRadius: '4px', display: 'flex' }}>
        <ChevronDown size={15} />
      </button>
    </div>
  )
}

function MainContent() {
  const [activeTab, setActiveTab] = useState('Felfedezés')
  const [activeFilter, setActiveFilter] = useState('Trending')
  const [showNewTopic, setShowNewTopic] = useState(false)
  const [discussionList, setDiscussionList] = useState([])
  const t = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''

  const loadTemak = () => {
    api.temak.getAll().then((data) => setDiscussionList(data.map((d) => ({
      ...d,
      author: d.authorName,
      time: new Date(d.createdAt).toLocaleDateString('hu-HU'),
      comments: d.commentCount,
      avatars: [d.authorColor || '#4ade80'],
    }))))
  }

  useEffect(() => { loadTemak() }, [])

  const filteredDiscussions = searchQuery
    ? discussionList.filter(d =>
        d.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.author?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : discussionList

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: t.bg }}>
      {showNewTopic && <NewTopicModal onClose={() => setShowNewTopic(false)} onSubmit={async (topic) => {
        try {
          await api.temak.create({ title: topic.title, content: topic.content, category: topic.category, categoryColor: topic.categoryColor })
          await loadTemak()
          setShowNewTopic(false)
        } catch (err) {
          alert(err.message)
        }
      }} />}
      {/* Banner */}
      <div style={{ position: 'relative', height: '200px', backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.6) 100%), url(/rf4bg.png)`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'flex-end', padding: '1.5rem 2rem', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100%', background: t.bannerGlow }} />
        <div style={{ position: 'relative' }}>
          <h1 style={{ color: '#f8fafc', fontSize: '2rem', fontWeight: '800', margin: 0, letterSpacing: '-0.02em' }}>RF4 Magyar Fórum</h1>
          <p style={{ color: 'rgba(248,250,252,0.75)', margin: '0.3rem 0 0', fontSize: '0.88rem' }}>Magyarország legnagyobb Russian Fishing 4 közössége</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${t.border}`, padding: '0 2rem', background: t.bgCard }}>
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: activeTab === tab ? '#22c55e' : t.textMuted,
            padding: '0.85rem 1rem', fontSize: '0.875rem', fontWeight: activeTab === tab ? '600' : '400',
            borderBottom: activeTab === tab ? '2px solid #22c55e' : '2px solid transparent',
            marginBottom: '-1px', transition: 'color 0.15s',
          }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Body – görgethető */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem 2rem' }}>

        {/* Discussions */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ color: t.text, fontSize: '1.1rem', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="#4ade80" /> Megbeszélések
            </h2>
            <button onClick={() => { if (!user) { navigate('/login'); return; } setShowNewTopic(true) }} style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.45rem 1rem', fontWeight: '600', fontSize: '0.78rem', cursor: 'pointer', letterSpacing: '0.03em' }}>
              + ÚJ TÉMA
            </button>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {['Trending', 'Legújabb', 'Legnépszerűbb'].map((f) => (
              <button key={f} onClick={() => setActiveFilter(f)} style={{
                background: activeFilter === f ? t.filterActiveBg : 'transparent',
                color: activeFilter === f ? t.filterActiveColor : t.textMuted,
                border: '1px solid ' + (activeFilter === f ? t.filterActiveBorder : t.border),
                borderRadius: '6px', padding: '0.3rem 0.85rem', fontSize: '0.78rem', cursor: 'pointer',
                fontWeight: activeFilter === f ? '600' : '400',
              }}>
                {f}
              </button>
            ))}
          </div>

          {/* Search banner */}
          {searchQuery && (
            <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '0.6rem 1rem', marginBottom: '0.75rem', color: t.textSec, fontSize: '0.82rem' }}>
              Keresési eredmények: "<strong style={{ color: '#4ade80' }}>{searchQuery}</strong>" ({filteredDiscussions.length} találat)
            </div>
          )}

          {/* Discussion list */}
          {filteredDiscussions.map((d) => (
            <div key={d.id} style={{
              display: 'flex', gap: '0.875rem', padding: '1rem', marginBottom: '0.5rem',
              background: t.bgCard, borderRadius: '10px', alignItems: 'flex-start',
              border: `1px solid ${t.border}`, borderLeft: `3px solid ${d.categoryColor}`,
            }}>
              <VoteButton count={d.votes} />
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: t.bgRaised, flexShrink: 0, border: `1px solid ${t.border}` }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                  <span style={{ background: `${d.categoryColor}22`, color: d.categoryColor, fontSize: '0.7rem', fontWeight: '600', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>{d.category}</span>
                </div>
                <a href={`/discussion/${d.id}`} style={{ color: t.text, textDecoration: 'none', fontWeight: '500', fontSize: '0.92rem', lineHeight: 1.45, display: 'block' }}>{d.title}</a>
                <div style={{ color: t.textMuted, fontSize: '0.73rem', marginTop: '0.3rem' }}>Írta: <span style={{ color: t.textMuted }}>{d.author}</span> · {d.time}</div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.6rem' }}>
                  {[
                    { icon: <MessageSquare size={13} />, label: `${d.comments} hozzászólás` },
                    { icon: <Share2 size={13} />, label: 'Megosztás' },
                    { icon: <Bookmark size={13} />, label: 'Mentés' },
                  ].map(({ icon, label }) => (
                    <button key={label} style={{ background: 'none', border: 'none', color: t.textDim, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', padding: 0 }}>
                      {icon} {label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex' }}>
                {d.avatars.map((color, i) => (
                  <div key={i} style={{ width: '22px', height: '22px', borderRadius: '50%', background: color, marginLeft: i > 0 ? '-5px' : 0, border: `2px solid ${t.bgCard}` }} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Lobbies */}
        <div style={{ width: '220px', flexShrink: 0 }}>
          <h2 style={{ color: t.text, fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Users size={16} color="#2d9c8a" /> Chat szobák
          </h2>
          <p style={{ color: t.textMuted, fontSize: '0.75rem', marginBottom: '1rem' }}>Csatlakozz más horgászokhoz!</p>
          {lobbies.map((lobby) => (
            <div key={lobby.id} style={{ padding: '0.75rem', marginBottom: '0.4rem', background: t.bgCard, borderRadius: '8px', cursor: 'pointer', border: `1px solid ${t.border}` }}>
              <div style={{ color: '#4ade80', fontSize: '0.83rem', fontWeight: '600' }}>{lobby.name}</div>
              <div style={{ color: t.textMuted, fontSize: '0.73rem', margin: '0.2rem 0' }}>{lobby.desc}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: t.textMuted, fontSize: '0.72rem', marginTop: '0.4rem' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
                {lobby.users} online
              </div>
            </div>
          ))}
        </div>

      </div>
      </div>
    </div>
  )
}

export default MainContent
