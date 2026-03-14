import { useState, useEffect } from 'react'
import { MapPin, Fish, Star, Users, Filter } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { api } from '../api/index'

const spots = [
  {
    id: 1,
    name: 'Mosquito Lake',
    region: 'Oroszország',
    fish: ['Csuka', 'Sügér', 'Ponty'],
    difficulty: 'Kezdő',
    difficultyColor: '#2d9c8a',
    rating: 4.2,
    activeUsers: 34,
    description: 'Tökéletes hely kezdőknek. Sekély vizek, sok hal, könnyen megközelíthető.',
    tags: ['kezdő', 'ponty', 'csuka'],
  },
  {
    id: 2,
    name: 'Winding Rivulet',
    region: 'Oroszország',
    fish: ['Pisztráng', 'Folyami sügér'],
    difficulty: 'Kezdő',
    difficultyColor: '#2d9c8a',
    rating: 3.8,
    activeUsers: 18,
    description: 'Csendes kis folyó, ideális lazac- és pisztrángos horgászathoz.',
    tags: ['folyó', 'pisztráng'],
  },
  {
    id: 3,
    name: 'Belaya River',
    region: 'Baskíria',
    fish: ['Harcsa', 'Csuka', 'Kecsege'],
    difficulty: 'Közepes',
    difficultyColor: '#2d9c8a',
    rating: 4.5,
    activeUsers: 56,
    description: 'Változatos halfajok, erős sodrás. Tapasztalt horgászoknak ajánlott.',
    tags: ['folyó', 'harcsa', 'verseny'],
  },
  {
    id: 4,
    name: 'Ladoga Lake',
    region: 'Karélia',
    fish: ['Lazac', 'Tőkehal', 'Harcsa'],
    difficulty: 'Közepes',
    difficultyColor: '#2d9c8a',
    rating: 4.7,
    activeUsers: 89,
    description: 'Európa legnagyobb tava. Hatalmas halfajta-választék, időjárás befolyásolja.',
    tags: ['tó', 'lazac', 'nagy hal'],
  },
  {
    id: 5,
    name: 'Sura River',
    region: 'Volga vidék',
    fish: ['Viza', 'Harcsa', 'Süllő'],
    difficulty: 'Haladó',
    difficultyColor: '#f87171',
    rating: 4.9,
    activeUsers: 41,
    description: 'A legnehezebb és legjutalmazóbb spot. Rekordméretek lehetségesek.',
    tags: ['folyó', 'rekord', 'haladó'],
  },
  {
    id: 6,
    name: 'Volga River Delta',
    region: 'Asztrahán',
    fish: ['Harcsa', 'Ponty', 'Süllő', 'Viza'],
    difficulty: 'Haladó',
    difficultyColor: '#f87171',
    rating: 4.8,
    activeUsers: 73,
    description: 'Legendás horgászhely. A legnagyobb halfajták itt találhatók.',
    tags: ['delta', 'rekord', 'harcsa'],
  },
]

const difficulties = ['Mind', 'Kezdő', 'Közepes', 'Haladó']

function StarRating({ value }) {
  const t = useTheme()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={11} fill={s <= Math.round(value) ? '#2d9c8a' : 'none'} color={s <= Math.round(value) ? '#2d9c8a' : t.textDim} />
      ))}
      <span style={{ color: t.textMuted, fontSize: '0.75rem', marginLeft: '0.2rem' }}>{value}</span>
    </div>
  )
}

function Spotok() {
  const [activeDiff, setActiveDiff] = useState('Mind')
  const [search, setSearch] = useState('')
  const [spotList, setSpotList] = useState([])
  const t = useTheme()

  useEffect(() => {
    api.spotok.getAll().then((data) => setSpotList(data.map((s) => ({
      ...s,
      name: s.nev, region: s.regio, fish: s.halfajok,
      difficulty: s.nehezseg, difficultyColor: s.nehezsegSzin,
      rating: s.ertekeles, activeUsers: s.aktivFelh, description: s.leiras,
    }))))
  }, [])

  const filtered = spotList.filter((s) => {
    const matchDiff = activeDiff === 'Mind' || s.difficulty === activeDiff
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.region.toLowerCase().includes(search.toLowerCase())
    return matchDiff && matchSearch
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: t.bg, overflowY: 'auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
          <MapPin size={20} color="#4ade80" />
          <h1 style={{ color: t.text, fontSize: '1.3rem', fontWeight: '700', margin: 0 }}>Horgászspotok</h1>
        </div>
        <p style={{ color: t.textMuted, fontSize: '0.85rem' }}>Ismerd meg az összes horgászhely jellemzőit és tapasztalatait.</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '0.45rem 0.75rem', flex: '1', maxWidth: '260px' }}>
          <Filter size={13} color={t.textMuted} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Keresés név vagy régió alapján..."
            style={{ background: 'none', border: 'none', outline: 'none', color: t.textSec, fontSize: '0.82rem', width: '100%' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {difficulties.map((d) => (
            <button key={d} onClick={() => setActiveDiff(d)} style={{
              background: activeDiff === d ? t.filterActiveBg : 'transparent',
              color: activeDiff === d ? t.filterActiveColor : t.textMuted,
              border: '1px solid ' + (activeDiff === d ? t.filterActiveBorder : t.border),
              borderRadius: '7px', padding: '0.35rem 0.85rem',
              fontSize: '0.78rem', fontWeight: activeDiff === d ? '600' : '400', cursor: 'pointer',
            }}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {filtered.map((spot) => (
          <div key={spot.id} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.15s' }}>
            {/* Card header */}
            <div style={{ background: t.spotCardHeader, padding: '1.25rem', borderBottom: `1px solid ${t.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ color: t.text, fontSize: '1rem', fontWeight: '700', margin: '0 0 0.2rem' }}>{spot.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: t.textMuted, fontSize: '0.75rem' }}>
                    <MapPin size={11} /> {spot.region}
                  </div>
                </div>
                <span style={{ background: `${spot.difficultyColor}22`, color: spot.difficultyColor, fontSize: '0.7rem', fontWeight: '600', padding: '0.2rem 0.6rem', borderRadius: '5px' }}>
                  {spot.difficulty}
                </span>
              </div>
            </div>

            {/* Card body */}
            <div style={{ padding: '1rem' }}>
              <p style={{ color: t.textMuted, fontSize: '0.8rem', lineHeight: 1.6, marginBottom: '0.875rem' }}>{spot.description}</p>

              {/* Fish */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <Fish size={13} color="#4ade80" />
                {spot.fish.map((f) => (
                  <span key={f} style={{ background: t.bgRaised, color: t.textSec, fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '4px', border: `1px solid ${t.border}` }}>{f}</span>
                ))}
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: `1px solid ${t.border}` }}>
                <StarRating value={spot.rating} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: t.textMuted, fontSize: '0.75rem' }}>
                  <Users size={12} /> {spot.activeUsers} aktív
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: t.textDim }}>
          <MapPin size={32} style={{ marginBottom: '0.75rem', opacity: 0.3 }} />
          <p>Nincs találat a megadott szűrőkre.</p>
        </div>
      )}
    </div>
  )
}

export default Spotok
