import { useState } from 'react'
import { Flame, Link, ChevronsRight, ChevronsLeft } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const contributors = [
  { name: 'NagyFogás', points: 120, flames: 15, color: '#4ade80' },
  { name: 'MesterHorgász', points: 114, flames: 14, color: '#2d9c8a' },
  { name: 'TapasztaltZoli', points: 109, flames: 14, color: '#8ab84d' },
  { name: 'HorgászPéter', points: 95, flames: 12, color: '#c8a87a' },
  { name: 'RecordHunter', points: 90, flames: 10, color: '#64748b' },
]

const recentActivity = [
  { user: 'NagyFogás', action: 'új témát nyitott', time: '5 perce', color: '#4ade80' },
  { user: 'MesterHorgász', action: 'hozzászólt', time: '12 perce', color: '#2d9c8a' },
  { user: 'UjHorgász99', action: 'csatlakozott', time: '1 órája', color: '#8ab84d' },
]

function RightPanel() {
  const [open, setOpen] = useState(true)
  const t = useTheme()
  return (
    <aside style={{
      width: open ? '240px' : '40px', flexShrink: 0,
      borderLeft: `1px solid ${t.border}`, height: '100vh', position: 'sticky',
      top: 0, overflowY: open ? 'auto' : 'hidden', background: t.bgCard,
      transition: 'width 0.3s', overflow: 'hidden',
    }}>
      {/* Toggle gomb */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 0.75rem', borderBottom: `1px solid ${t.border}`, justifyContent: open ? 'space-between' : 'center' }}>
        {open && <p style={{ color: t.textDim, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600', margin: 0 }}>Téma Panel</p>}
        <button
          onClick={() => setOpen(!open)}
          style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', display: 'flex', flexShrink: 0 }}
        >
          {open ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
        </button>
      </div>

      {open && <div style={{ padding: '1rem 1rem 1.25rem' }}>

      {/* Connect account */}
      <div style={{ background: t.bg, borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem', border: `1px solid ${t.border}` }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.6rem' }}>
          <Link size={15} color="#fff" />
        </div>
        <p style={{ color: t.text, fontSize: '0.83rem', fontWeight: '600', marginBottom: '0.35rem' }}>Kösd össze RF4 fiókodat</p>
        <p style={{ color: t.textMuted, fontSize: '0.73rem', marginBottom: '0.75rem', lineHeight: 1.5 }}>Erősítsd meg az e-mailben küldött linkkel.</p>
        <button style={{ width: '100%', background: t.navActiveBg, border: `1px solid ${t.navActiveBorder}`, color: t.green, borderRadius: '7px', padding: '0.5rem', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', letterSpacing: '0.04em' }}>
          FIÓK ÖSSZEKÖTÉSE
        </button>
      </div>

      {/* Stats */}
      <div style={{ background: t.bg, borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem', border: `1px solid ${t.border}` }}>
        <p style={{ color: t.textSec, fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.75rem' }}>Fórum statisztikák</p>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ color: t.text, fontWeight: '700', fontSize: '1.2rem' }}>155</div>
            <div style={{ color: t.textMuted, fontSize: '0.7rem' }}>Feliratkozó</div>
          </div>
          <div>
            <div style={{ color: t.blue, fontWeight: '700', fontSize: '1.2rem' }}>+34</div>
            <div style={{ color: t.textMuted, fontSize: '0.7rem' }}>Új bejegyzés / hét</div>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          {contributors.slice(0, 5).map((c, i) => (
            <div key={i} title={c.name} style={{ width: '26px', height: '26px', borderRadius: '50%', background: c.color, marginLeft: i > 0 ? '-5px' : 0, border: `2px solid ${t.bg}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.62rem', fontWeight: 'bold' }}>
              {c.name[0]}
            </div>
          ))}
          <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: t.border, marginLeft: '-5px', border: `2px solid ${t.bg}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.textMuted, fontSize: '0.62rem' }}>+18</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ marginBottom: '1.25rem' }}>
        <p style={{ color: t.textSec, fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.75rem' }}>Legutóbbi aktivitás</p>
        {recentActivity.map((a, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.6rem', alignItems: 'flex-start' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: a.color, marginTop: '5px', flexShrink: 0 }} />
            <div>
              <span style={{ color: t.textSec, fontSize: '0.75rem' }}><strong style={{ color: a.color }}>{a.user}</strong> {a.action}</span>
              <div style={{ color: t.textDim, fontSize: '0.68rem' }}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Popular Contributors */}
      <div>
        <p style={{ color: t.textSec, fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.3rem' }}>Népszerű közreműködők</p>
        <p style={{ color: t.textDim, fontSize: '0.7rem', marginBottom: '0.75rem' }}>Légy aktív és szerezz jelvényeket!</p>
        {contributors.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem', padding: '0.5rem 0.6rem', borderRadius: '8px', background: i === 0 ? t.rank1Bg : t.bg, border: '1px solid ' + (i === 0 ? t.rank1Border : t.border) }}>
            <span style={{ color: t.textDim, fontSize: '0.7rem', width: '14px', textAlign: 'center' }}>{i + 1}</span>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: c.color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '0.72rem' }}>
              {c.name[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: t.textSec, fontSize: '0.78rem', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
              <div style={{ color: t.textMuted, fontSize: '0.68rem' }}>{c.points} pont</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: t.green, fontSize: '0.73rem' }}>
              <Flame size={11} /> {c.flames}
            </div>
          </div>
        ))}
      </div>
      </div>}
    </aside>
  )
}

export default RightPanel
