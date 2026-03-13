import { ShieldCheck, AlertTriangle, MessageSquare, Users, Ban, Mail } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const sections = [
  {
    icon: Users,
    color: '#4ade80',
    title: 'Általános viselkedési szabályok',
    rules: [
      'Légy tisztelettudó minden felhasználóval szemben. Személyeskedés, sértés, zaklatás tilos.',
      'Tartsd be a kulturált hangnemet. Trágár vagy gyűlöletkeltő nyelvezet nem megengedett.',
      'Ne szólj bele mások vitájába feleslegesen — tartsd magad a témához.',
      'Reklámozás, spam és kereskedelmi célú bejegyzés közzététele tilos.',
      'Más felhasználó személyes adatainak (email, lakcím stb.) megosztása szigorúan tiltott.',
    ],
  },
  {
    icon: MessageSquare,
    color: '#2d9c8a',
    title: 'Bejegyzésekkel kapcsolatos szabályok',
    rules: [
      'Minden bejegyzést a megfelelő kategóriába posztolj. A félresorolt témákat a moderátorok áthelyezhetik.',
      'A cím legyen informatív és tömör — segítse a többi felhasználót a téma megtalálásában.',
      'Mielőtt új témát nyitsz, ellenőrizd, hogy a kérdésed nem szerepel-e már a fórumon.',
      'Duplikált bejegyzések (ugyanaz a téma többször) törölve lesznek.',
      'Tilos mások szövegét, képét vagy tartalmát az ő engedélyük nélkül saját névvel megosztani.',
    ],
  },
  {
    icon: ShieldCheck,
    color: '#2d9c8a',
    title: 'Horgász tartalmakra vonatkozó elvárások',
    rules: [
      'A spotok, fogások és tippek megosztásakor törekedj a pontos és valós információkra.',
      'Fogásokat csak valódi saját élmény alapján posztolj — a manipulált képek vagy hazugságok azonnali bannolást vonnak maguk után.',
      'Ha valamilyen stratégiát vagy technikát megosztasz, jelezd egyértelműen, ha az tapasztalaton vagy feltételezésen alapul.',
      'Az RF4 játék mechanikájával kapcsolatos hibákat, visszaéléseket ne propagáld — jelezd a fejlesztők felé.',
    ],
  },
  {
    icon: AlertTriangle,
    color: '#fb923c',
    title: 'Tiltott tartalmak',
    rules: [
      'Politikai, vallási vagy ideológiai viták és tartalmak.',
      'Felnőtt tartalom, erőszakos vagy sokkoló anyagok.',
      'Hamis információk terjesztése a játékkal vagy közösséggel kapcsolatban.',
      'Vírusok, kártékony linkek vagy adathalász kísérletek közzététele.',
      'Más fórumok vagy közösségek negatív megítélésére irányuló tartalom.',
    ],
  },
  {
    icon: Ban,
    color: '#f87171',
    title: 'Szankciók és moderálás',
    rules: [
      '1. figyelmeztetés: írásbeli figyelmeztetés a moderátortól.',
      '2. figyelmeztetés: átmeneti kitiltás (1–7 nap).',
      '3. figyelmeztetés vagy súlyos szabálysértés: végleges kitiltás.',
      'A moderátorok fenntartják a jogot, hogy súlyos esetekben azonnali kitiltást alkalmazzanak.',
      'A szankciók ellen fellebbezni az admin email-en lehet.',
    ],
  },
  {
    icon: Mail,
    color: '#a78bfa',
    title: 'Kapcsolat és visszajelzés',
    rules: [
      'Ha szabálysértést tapasztalsz, használd a "Jelentés" funkciót vagy írj a moderátoroknak.',
      'A szabályzattal kapcsolatos kérdéseket és javaslatokat szívesen fogadjuk a kapcsolat oldalon.',
      'A fórum szabályzata bármikor módosítható — a változásokról értesítünk.',
    ],
  },
]

function Szabalyzat() {
  const t = useTheme()
  return (
    <div style={{ flex: 1, background: t.bg, minHeight: '100vh', padding: '2rem' }}>
      {/* Header */}
      <div style={{ maxWidth: '760px', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <ShieldCheck size={22} color="#4ade80" />
          <h1 style={{ color: t.text, fontSize: '1.3rem', fontWeight: '700', margin: 0 }}>Fórum Szabályzat</h1>
        </div>
        <p style={{ color: t.textMuted, fontSize: '0.85rem', lineHeight: 1.7 }}>
          A fórum célja egy barátságos, segítőkész közösség fenntartása. Kérjük, olvasd el és tartsd be az alábbi szabályokat — a részvétellel ezeket elfogadod.
        </p>
        <div style={{ marginTop: '1rem', background: t.bgCard, border: `1px solid ${t.borderFocus}`, borderRadius: '8px', padding: '0.75rem 1rem', display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
          <AlertTriangle size={15} color="#2d9c8a" style={{ flexShrink: 0, marginTop: '1px' }} />
          <p style={{ color: t.textSec, fontSize: '0.8rem', margin: 0, lineHeight: 1.6 }}>
            A szabályzat megsértése moderátori figyelmeztetést, átmeneti vagy végleges kitiltást vonhat maga után.
          </p>
        </div>
      </div>

      {/* Sections */}
      <div style={{ maxWidth: '760px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {sections.map(({ icon: Icon, color, title, rules }, i) => (
          <div key={i} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', borderBottom: `1px solid ${t.border}`, borderLeft: `3px solid ${color}` }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={16} color={color} />
              </div>
              <h2 style={{ color: t.text, fontSize: '0.95rem', fontWeight: '600', margin: 0 }}>{title}</h2>
            </div>

            <ul style={{ margin: 0, padding: '0.75rem 1.25rem', listStyle: 'none' }}>
              {rules.map((rule, j) => (
                <li key={j} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.5rem 0', borderBottom: j < rules.length - 1 ? `1px solid ${t.border}` : 'none' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: color, flexShrink: 0, marginTop: '7px' }} />
                  <span style={{ color: t.textSec, fontSize: '0.83rem', lineHeight: 1.65 }}>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: '760px', marginTop: '1.5rem', color: t.textDim, fontSize: '0.75rem', textAlign: 'center' }}>
        Utolsó módosítás: 2026. március 13. · RF4 Magyar Fórum csapata
      </div>
    </div>
  )
}

export default Szabalyzat
