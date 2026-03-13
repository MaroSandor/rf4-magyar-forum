import { useState, useEffect } from 'react'
import { Fish, MapPin, Ruler, Clock, ChevronUp, ChevronDown, Trophy, Star, Filter, Plus, X, Cloud, Wind, Sun, ImagePlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/index'

const catches = [
  {
    id: 1, votes: 47,
    user: 'NagyFogás', userColor: '#4ade80',
    fish: 'Harcsa', weight: 38.5, length: 142,
    spot: 'Volga River Delta', bait: 'Élő csali (ponty)', depth: 6.5,
    weather: 'Felhős', time: '2026-03-12 06:30',
    note: 'Hajnal előtt 30 perccel vettem a merülőt. Közel egy órás harc után sikerült kiemelni.',
    tags: ['rekord', 'harcsa'],
    image: null,
  },
  {
    id: 2, votes: 31,
    user: 'MesterHorgász', userColor: '#2d9c8a',
    fish: 'Lazac', weight: 14.2, length: 98,
    spot: 'Ladoga Lake', bait: 'Villantó (ezüst)', depth: 3.2,
    weather: 'Napos', time: '2026-03-11 14:15',
    note: 'A keleti parton, a sziklák közelében akadt. Három dobásra jött az első harapás.',
    tags: ['lazac', 'ladoga'],
    image: null,
  },
  {
    id: 3, votes: 28,
    user: 'RecordHunter', userColor: '#8ab84d',
    fish: 'Csuka', weight: 11.8, length: 103,
    spot: 'Belaya River', bait: 'Wobbler (zöld)', depth: 1.8,
    weather: 'Szeles', time: '2026-03-10 09:00',
    note: 'A folyókanyarulatnál, sekély vízben fogott. Wobblerre azonnal rávágott.',
    tags: ['csuka', 'folyó'],
    image: null,
  },
  {
    id: 4, votes: 19,
    user: 'TapasztaltZoli', userColor: '#c8a87a',
    fish: 'Ponty', weight: 8.4, length: 74,
    spot: 'Mosquito Lake', bait: 'Kukorica', depth: 2.1,
    weather: 'Napos', time: '2026-03-09 11:45',
    note: 'Klasszikus kukoricás módszer, türelemmel. Másfél óra várakozás után jött.',
    tags: ['ponty', 'kezdő'],
    image: null,
  },
  {
    id: 5, votes: 22,
    user: 'HorgászPéter', userColor: '#4ade80',
    fish: 'Kecsege', weight: 5.9, length: 61,
    spot: 'Belaya River', bait: 'Giliszta', depth: 4.5,
    weather: 'Borult', time: '2026-03-08 17:30',
    note: 'Ritka fogás, nagyon örültem neki! A folyó közepén, mély részen volt.',
    tags: ['ritka', 'kecsege'],
    image: null,
  },
  {
    id: 6, votes: 15,
    user: 'UjHorgász99', userColor: '#2d9c8a',
    fish: 'Pisztráng', weight: 2.3, length: 42,
    spot: 'Winding Rivulet', bait: 'Szárazlégy', depth: 0.8,
    weather: 'Napos', time: '2026-03-07 08:00',
    note: 'Az első komolyabb pisztrángom! Légypiszkálással, a sebesebb részen.',
    tags: ['pisztráng', 'kezdő'],
    image: null,
  },
]

const leaderboard = [
  { rank: 1, user: 'NagyFogás', color: '#4ade80', fish: 'Harcsa', weight: 38.5 },
  { rank: 2, user: 'VolgaKing', color: '#2d9c8a', fish: 'Viza', weight: 31.2 },
  { rank: 3, user: 'RecordHunter', color: '#8ab84d', fish: 'Harcsa', weight: 27.8 },
  { rank: 4, user: 'MesterHorgász', color: '#c8a87a', fish: 'Lazac', weight: 14.2 },
  { rank: 5, user: 'TapasztaltZoli', color: '#64748b', fish: 'Csuka', weight: 11.8 },
]

const fishTypes = ['Mind', 'Harcsa', 'Lazac', 'Csuka', 'Ponty', 'Kecsege', 'Pisztráng', 'Viza']
const sortOptions = [
  { key: 'votes', label: 'Legnépszerűbb' },
  { key: 'weight', label: 'Legsúlyosabb' },
  { key: 'date', label: 'Legújabb' },
]

const tagColors = {
  rekord: '#4ade80',
  ritka: '#c8a87a',
  kezdő: '#2d9c8a',
  harcsa: '#64748b',
  lazac: '#8ab84d',
  csuka: '#64748b',
  pisztráng: '#2d9c8a',
  ponty: '#c8a87a',
  kecsege: '#4ade80',
  ladoga: '#2d9c8a',
  folyó: '#7a9c8a',
}

function VoteButton({ count }) {
  const [vote, setVote] = useState(0)
  const t = useTheme()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', minWidth: '32px' }}>
      <button onClick={() => setVote(vote === 1 ? 0 : 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: vote === 1 ? '#4ade80' : t.textDim, padding: '2px', display: 'flex' }}>
        <ChevronUp size={15} />
      </button>
      <span style={{ color: vote === 1 ? '#4ade80' : vote === -1 ? '#c0392b' : t.textSec, fontSize: '0.82rem', fontWeight: '700' }}>{count + vote}</span>
      <button onClick={() => setVote(vote === -1 ? 0 : -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: vote === -1 ? '#c0392b' : t.textDim, padding: '2px', display: 'flex' }}>
        <ChevronDown size={15} />
      </button>
    </div>
  )
}

const weatherIcon = { Napos: Sun, Felhős: Cloud, Borult: Cloud, Szeles: Wind }

const modalStyles = `
  @keyframes backdropIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
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

function CatchModal({ catch: c, onClose }) {
  const t = useTheme()

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const WeatherIcon = weatherIcon[c.weather] || Cloud

  return (
    <>
      <style>{modalStyles}</style>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem', animation: 'backdropIn 0.2s ease' }}
      >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: t.modalBg, border: `1px solid ${t.borderFocus}`, borderRadius: '16px', width: '100%', maxWidth: '520px', overflow: 'hidden', animation: 'cardIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both, borderGlow 0.6s ease forwards' }}
      >
        {/* Modal header */}
        <div style={{ background: t.modalHeader, padding: '1.5rem', borderBottom: `1px solid ${t.border}`, position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: t.navActiveBg, border: `1px solid ${t.navActiveBorder}`, borderRadius: '6px', color: t.textSec, cursor: 'pointer', padding: '4px', display: 'flex' }}>
            <X size={16} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${t.borderFocus}`, flexShrink: 0 }}>
              <Fish size={30} color="#4ade80" />
            </div>
            <div>
              <h2 style={{ color: t.text, fontSize: '1.4rem', fontWeight: '800', margin: '0 0 0.2rem' }}>{c.fish}</h2>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ color: '#4ade80', fontWeight: '700', fontSize: '1.1rem' }}>{c.weight} kg</span>
                <span style={{ color: t.textMuted, fontSize: '0.85rem' }}>· {c.length} cm</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.875rem', flexWrap: 'wrap' }}>
            {c.tags.map((tag) => (
              <span key={tag} style={{ background: `${tagColors[tag] || '#4ade80'}22`, color: tagColors[tag] || '#4ade80', fontSize: '0.72rem', fontWeight: '600', padding: '0.15rem 0.55rem', borderRadius: '4px' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Modal body */}
        <div style={{ padding: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1.25rem' }}>
            {[
              { icon: <MapPin size={13} color="#4ade80" />, label: 'Helyszín', value: c.spot },
              { icon: <Fish size={13} color="#4ade80" />, label: 'Csali', value: c.bait },
              { icon: <Ruler size={13} color="#4ade80" />, label: 'Mélység', value: `${c.depth} m` },
              { icon: <WeatherIcon size={13} color="#4ade80" />, label: 'Időjárás', value: c.weather },
              { icon: <Clock size={13} color="#4ade80" />, label: 'Időpont', value: c.time },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ background: t.modalDetailBg, borderRadius: '8px', padding: '0.6rem 0.75rem', border: `1px solid ${t.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
                  {icon}
                  <span style={{ color: t.textMuted, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>{label}</span>
                </div>
                <div style={{ color: t.text, fontSize: '0.82rem', fontWeight: '500' }}>{value}</div>
              </div>
            ))}
          </div>

          <div style={{ background: t.modalDetailBg, borderRadius: '8px', padding: '0.875rem', border: `1px solid ${t.border}`, marginBottom: '1.25rem' }}>
            <p style={{ color: t.textMuted, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', marginBottom: '0.4rem' }}>Leírás</p>
            <p style={{ color: t.textSec, fontSize: '0.85rem', lineHeight: 1.7, margin: 0 }}>{c.note}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: c.userColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.72rem', fontWeight: 'bold' }}>
                {c.user[0]}
              </div>
              <div>
                <div style={{ color: c.userColor, fontSize: '0.82rem', fontWeight: '600' }}>{c.user}</div>
                <div style={{ color: t.textDim, fontSize: '0.7rem' }}>Horgász</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#4ade80', fontSize: '0.85rem', fontWeight: '700' }}>
              <ChevronUp size={16} /> {c.votes} szavazat
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

const spotOptions = ['Mosquito Lake', 'Winding Rivulet', 'Belaya River', 'Ladoga Lake', 'Sura River', 'Volga River Delta']
const weatherOptions = ['Napos', 'Felhős', 'Borult', 'Szeles']

function CatchFormModal({ onClose, onSubmit }) {
  const t = useTheme()
  const [form, setForm] = useState({
    fish: '', weight: '', length: '', spot: '', bait: '', depth: '', weather: 'Napos', time: '', note: '', tags: '',
  })

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const inputStyle = {
    width: '100%', background: t.modalDetailBg, border: `1px solid ${t.border}`,
    borderRadius: '8px', padding: '0.55rem 0.75rem', color: t.text,
    fontSize: '0.83rem', outline: 'none', boxSizing: 'border-box',
  }
  const labelStyle = { color: t.textMuted, fontSize: '0.72rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.3rem' }

  const handleSubmit = () => {
    if (!form.fish || !form.weight) return
    onSubmit({
      id: Date.now(), votes: 0,
      user: 'Vendég', userColor: '#4ade80',
      fish: form.fish,
      weight: parseFloat(form.weight) || 0,
      length: parseFloat(form.length) || 0,
      spot: form.spot || 'Ismeretlen',
      bait: form.bait || '—',
      depth: parseFloat(form.depth) || 0,
      weather: form.weather,
      time: form.time || new Date().toISOString().slice(0, 16).replace('T', ' '),
      note: form.note || '',
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      image: null,
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
          style={{ background: t.modalBg, border: `1px solid ${t.borderFocus}`, borderRadius: '16px', width: '100%', maxWidth: '560px', overflow: 'hidden', animation: 'cardIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both, borderGlow 0.6s ease forwards', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
        >
          {/* Header */}
          <div style={{ background: t.modalHeader, padding: '1.25rem 1.5rem', borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Fish size={18} color="#fff" />
              </div>
              <div>
                <h2 style={{ color: t.text, fontSize: '1rem', fontWeight: '700', margin: 0 }}>Fogás megosztása</h2>
                <p style={{ color: t.textMuted, fontSize: '0.75rem', margin: 0 }}>Töltsd ki az adatokat és oszd meg a közösséggel</p>
              </div>
            </div>
            <button onClick={onClose} style={{ background: t.navActiveBg, border: `1px solid ${t.navActiveBorder}`, borderRadius: '6px', color: t.textSec, cursor: 'pointer', padding: '4px', display: 'flex' }}>
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Kép feltöltés */}
            <div style={{ border: `2px dashed ${t.border}`, borderRadius: '10px', padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: t.textMuted }}>
              <ImagePlus size={22} />
              <span style={{ fontSize: '0.8rem' }}>Kép feltöltése (opcionális)</span>
              <span style={{ fontSize: '0.72rem', color: t.textDim }}>JPG, PNG – max. 5 MB</span>
            </div>

            {/* Halfaj + súly + hossz */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Halfaj *</label>
                <input value={form.fish} onChange={set('fish')} placeholder="pl. Harcsa" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Súly (kg) *</label>
                <input value={form.weight} onChange={set('weight')} placeholder="pl. 12.5" type="number" min="0" step="0.1" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Hossz (cm)</label>
                <input value={form.length} onChange={set('length')} placeholder="pl. 95" type="number" min="0" style={inputStyle} />
              </div>
            </div>

            {/* Helyszín + csali */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Helyszín</label>
                <select value={form.spot} onChange={set('spot')} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">— válassz —</option>
                  {spotOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Csali</label>
                <input value={form.bait} onChange={set('bait')} placeholder="pl. Élő csali, Wobbler..." style={inputStyle} />
              </div>
            </div>

            {/* Mélység + időjárás + időpont */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Mélység (m)</label>
                <input value={form.depth} onChange={set('depth')} placeholder="pl. 3.5" type="number" min="0" step="0.1" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Időjárás</label>
                <select value={form.weather} onChange={set('weather')} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {weatherOptions.map((w) => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Időpont</label>
                <input value={form.time} onChange={set('time')} type="datetime-local" style={inputStyle} />
              </div>
            </div>

            {/* Leírás */}
            <div>
              <label style={labelStyle}>Leírás</label>
              <textarea value={form.note} onChange={set('note')} placeholder="Mesélj a fogásról — hol, hogyan, mikor..." rows={3} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
            </div>

            {/* Címkék */}
            <div>
              <label style={labelStyle}>Címkék (vesszővel elválasztva)</label>
              <input value={form.tags} onChange={set('tags')} placeholder="pl. rekord, folyó, hajnali" style={inputStyle} />
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '1rem 1.5rem', borderTop: `1px solid ${t.border}`, display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexShrink: 0 }}>
            <button onClick={onClose} style={{ background: 'none', border: `1px solid ${t.border}`, color: t.textSec, borderRadius: '8px', padding: '0.55rem 1.25rem', fontSize: '0.83rem', cursor: 'pointer' }}>
              Mégse
            </button>
            <button onClick={handleSubmit} style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.55rem 1.5rem', fontSize: '0.83rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Fish size={14} /> Megosztás
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function Fogasok() {
  const [activeFish, setActiveFish] = useState('Mind')
  const [activeSort, setActiveSort] = useState('date')
  const [selectedCatch, setSelectedCatch] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [catchList, setCatchList] = useState([])
  const [loading, setLoading] = useState(true)
  const t = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()

  const loadFogasok = () => api.fogasok.getAll()
    .then((data) => setCatchList(data.map((f) => ({
      ...f,
      fish: f.halfaj,
      user: f.authorName, userColor: f.authorColor,
      weight: f.suly, length: f.hossz, spot: f.spot,
      bait: f.csali, depth: f.melyseg, weather: f.idojaras, time: f.fogasIdeje, note: f.leiras,
    }))))
    .finally(() => setLoading(false))

  useEffect(() => { loadFogasok() }, [])

  const handleSubmit = async (formData) => {
    try {
      await api.fogasok.create({
        halfaj: formData.fish, suly: formData.weight, hossz: formData.length,
        spot: formData.spot, csali: formData.bait, melyseg: formData.depth,
        idojaras: formData.weather, fogasIdeje: formData.time,
        leiras: formData.note, tags: formData.tags,
      })
      await loadFogasok()
    } catch (err) {
      alert(err.message || 'Hiba történt. Ellenőrizd, hogy be vagy-e jelentkezve.')
    }
  }

  const filtered = catchList
    .filter((c) => activeFish === 'Mind' || c.fish === activeFish)
    .sort((a, b) => {
      if (activeSort === 'votes') return b.votes - a.votes
      if (activeSort === 'weight') return b.weight - a.weight
      return new Date(b.time) - new Date(a.time)
    })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: t.bg }}>
      {selectedCatch && <CatchModal catch={selectedCatch} onClose={() => setSelectedCatch(null)} />}
      {showForm && <CatchFormModal onClose={() => setShowForm(false)} onSubmit={handleSubmit} />}

      {/* Header – fix */}
      <div style={{ padding: '2rem 2rem 1rem', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
              <Fish size={20} color="#4ade80" />
              <h1 style={{ color: t.text, fontSize: '1.3rem', fontWeight: '700', margin: 0 }}>Fogások</h1>
            </div>
            <p style={{ color: t.textMuted, fontSize: '0.85rem', margin: 0 }}>Oszd meg a legjobb fogásaidat a közösséggel!</p>
          </div>
          <button onClick={() => { if (!user) { navigate('/login'); return; } setShowForm(true) }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.5rem 1.1rem', fontWeight: '600', fontSize: '0.82rem', cursor: 'pointer' }}>
            <Plus size={15} /> Fogás megosztása
          </button>
        </div>
      </div>

      {/* Tartalom */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', gap: '1.5rem', padding: '0 2rem 2rem' }}>

        {/* Fogáslista – görgethető */}
        <div style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
      {loading && <div style={{ color: t.textMuted, padding: '3rem', textAlign: 'center' }}>Betöltés...</div>}

          {/* Filters */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Filter size={13} color={t.textMuted} />
              <span style={{ color: t.textMuted, fontSize: '0.78rem' }}>Halfaj:</span>
            </div>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {fishTypes.map((f) => (
                <button key={f} onClick={() => setActiveFish(f)} style={{
                  background: activeFish === f ? t.filterActiveBg : 'transparent',
                  color: activeFish === f ? t.filterActiveColor : t.textMuted,
                  border: '1px solid ' + (activeFish === f ? t.filterActiveBorder : t.border),
                  borderRadius: '6px', padding: '0.25rem 0.65rem',
                  fontSize: '0.75rem', fontWeight: activeFish === f ? '600' : '400', cursor: 'pointer',
                }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem' }}>
            {sortOptions.map(({ key, label }) => (
              <button key={key} onClick={() => setActiveSort(key)} style={{
                background: activeSort === key ? t.filterActiveBg : 'transparent',
                color: activeSort === key ? t.filterActiveColor : t.textMuted,
                border: '1px solid ' + (activeSort === key ? t.filterActiveBorder : t.border),
                borderRadius: '6px', padding: '0.3rem 0.85rem',
                fontSize: '0.78rem', fontWeight: activeSort === key ? '600' : '400', cursor: 'pointer',
              }}>
                {label}
              </button>
            ))}
          </div>

          {/* Catch cards */}
          {filtered.map((c) => (
            <div key={c.id} onClick={() => setSelectedCatch(c)} style={{
              display: 'flex', gap: '0.875rem', padding: '1rem', marginBottom: '0.6rem',
              background: t.bgCard, borderRadius: '12px', border: `1px solid ${t.border}`,
              borderLeft: '3px solid #4ade80', cursor: 'pointer',
            }}>
              <div onClick={(e) => e.stopPropagation()}>
                <VoteButton count={c.votes} />
              </div>

              <div style={{ width: '64px', height: '64px', borderRadius: '8px', background: t.fishPlaceholderBg, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${t.border}` }}>
                <Fish size={24} color={t.fishPlaceholderIcon} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ color: t.text, fontWeight: '700', fontSize: '0.95rem' }}>{c.fish}</span>
                  <span style={{ color: '#4ade80', fontWeight: '700', fontSize: '0.95rem' }}>{c.weight} kg</span>
                  <span style={{ color: t.textMuted, fontSize: '0.8rem' }}>· {c.length} cm</span>
                  {c.tags.map((tag) => (
                    <span key={tag} style={{ background: `${tagColors[tag] || '#4ade80'}22`, color: tagColors[tag] || '#4ade80', fontSize: '0.68rem', fontWeight: '600', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: t.textMuted, fontSize: '0.75rem' }}>
                    <MapPin size={11} color="#4ade80" /> {c.spot}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: t.textMuted, fontSize: '0.75rem' }}>
                    <Fish size={11} color={t.textMuted} /> {c.bait}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: t.textMuted, fontSize: '0.75rem' }}>
                    <Ruler size={11} color={t.textMuted} /> {c.depth} m mélység
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: t.textMuted, fontSize: '0.75rem' }}>
                    <Clock size={11} color={t.textMuted} /> {c.time}
                  </span>
                </div>

                <p style={{ color: t.textMuted, fontSize: '0.8rem', lineHeight: 1.6, margin: '0 0 0.5rem' }}>{c.note}</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: c.userColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.6rem', fontWeight: 'bold' }}>
                    {c.user[0]}
                  </div>
                  <span style={{ color: c.userColor, fontSize: '0.75rem', fontWeight: '600' }}>{c.user}</span>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: t.textDim }}>
              <Fish size={32} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
              <p style={{ fontSize: '0.85rem' }}>Nincs fogás ebben a kategóriában.</p>
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div style={{ width: '220px', flexShrink: 0 }}>
          {/* Weekly best */}
          <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Star size={15} color="#4ade80" />
              <h3 style={{ color: t.text, fontSize: '0.88rem', fontWeight: '700', margin: 0 }}>Heti legjobb</h3>
            </div>
            <div style={{ background: t.weeklyBestBg, borderRadius: '8px', padding: '0.875rem', textAlign: 'center', border: `1px solid ${t.weeklyBestBorder}` }}>
              <Fish size={28} color="#4ade80" style={{ marginBottom: '0.4rem' }} />
              <div style={{ color: t.text, fontWeight: '700', fontSize: '1rem' }}>Harcsa</div>
              <div style={{ color: t.gold, fontWeight: '800', fontSize: '1.3rem' }}>38.5 kg</div>
              <div style={{ color: t.textMuted, fontSize: '0.72rem', marginTop: '0.2rem' }}>NagyFogás · Volga Delta</div>
            </div>
          </div>

          {/* Leaderboard */}
          <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Trophy size={15} color="#4ade80" />
              <h3 style={{ color: t.text, fontSize: '0.88rem', fontWeight: '700', margin: 0 }}>Ranglista</h3>
            </div>
            {leaderboard.map((entry) => (
              <div key={entry.rank} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', padding: '0.5rem 0.6rem', borderRadius: '8px', background: entry.rank === 1 ? t.rank1Bg : t.bg, border: '1px solid ' + (entry.rank === 1 ? t.rank1Border : t.border) }}>
                <span style={{ color: entry.rank === 1 ? t.gold : t.textDim, fontSize: '0.72rem', fontWeight: '700', width: '14px', textAlign: 'center' }}>
                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                </span>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: entry.color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.62rem', fontWeight: 'bold' }}>
                  {entry.user[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: t.textSec, fontSize: '0.75rem', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{entry.user}</div>
                  <div style={{ color: t.textMuted, fontSize: '0.68rem' }}>{entry.fish} · {entry.weight} kg</div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '1rem', marginTop: '1rem' }}>
            <h3 style={{ color: t.text, fontSize: '0.88rem', fontWeight: '700', margin: '0 0 0.75rem' }}>Statisztika</h3>
            {[
              { label: 'Összes fogás', value: '1 247', gold: false },
              { label: 'Ezen a héten', value: '38', gold: false },
              { label: 'Rekord', value: '38.5 kg', gold: true },
            ].map(({ label, value, gold }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: t.textMuted, fontSize: '0.75rem' }}>{label}</span>
                <span style={{ color: gold ? t.gold : '#4ade80', fontSize: '0.75rem', fontWeight: '700' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Fogasok
