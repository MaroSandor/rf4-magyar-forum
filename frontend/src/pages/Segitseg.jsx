import { useState } from 'react'
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageSquare, Fish, ShieldCheck, Settings } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const categories = [
  {
    id: 'altalanos',
    label: 'Általános',
    icon: HelpCircle,
    color: '#4ade80',
    questions: [
      {
        q: 'Mi az RF4 Magyar Fórum célja?',
        a: 'Az RF4 Magyar Fórum egy közösségi platform, ahol a Russian Fishing 4 játékosok tapasztalatokat, tippeket és fogásokat oszthatnak meg egymással magyarul.',
      },
      {
        q: 'Ingyenes a regisztráció?',
        a: 'Igen, a fórum teljesen ingyenes. Regisztrálj, és azonnal hozzáférhetsz az összes tartalomhoz.',
      },
      {
        q: 'Milyen böngészőkkel működik a fórum?',
        a: 'A fórum minden modern böngészővel kompatibilis: Chrome, Firefox, Safari, Edge. Javasoljuk a legfrissebb verzió használatát.',
      },
    ],
  },
  {
    id: 'fiok',
    label: 'Fiók kezelés',
    icon: Settings,
    color: '#2d9c8a',
    questions: [
      {
        q: 'Hogyan regisztrálhatok?',
        a: 'Kattints a "Bejelentkezés" menüpontra, majd válaszd a "Regisztráció" lehetőséget. Töltsd ki az űrlapot, erősítsd meg az e-mail-ed, és máris használhatod a fórumot.',
      },
      {
        q: 'Elfelejtettem a jelszavamat. Mit tegyek?',
        a: 'A bejelentkezési oldalon kattints az "Elfelejtett jelszó" linkre. Megadod az e-mail-ed, és küldünk egy visszaállítási linket.',
      },
      {
        q: 'Hogyan változtathatom meg a felhasználónevemet?',
        a: 'Jelenleg a felhasználónév megváltoztatásához moderátori segítség szükséges. Írj nekünk a kapcsolat oldalon, és 24 órán belül intézzük.',
      },
      {
        q: 'Hogyan tudom törölni a fiókomat?',
        a: 'Fiók törlési kérelmet a kapcsolat oldalon keresztül lehet benyújtani. A törlés visszavonhatatlan, ezért kérjük, fontold meg alaposan.',
      },
    ],
  },
  {
    id: 'forum',
    label: 'Fórum használata',
    icon: MessageSquare,
    color: '#c8a87a',
    questions: [
      {
        q: 'Hogyan nyithatok új témát?',
        a: 'A főoldalon a "Megbeszélések" szekció alatt kattints az "+ ÚJ TÉMA" gombra. Válaszd ki a megfelelő kategóriát, adj meg egy informatív címet, és írd meg a bejegyzésed.',
      },
      {
        q: 'Miért lett törölve a bejegyzésem?',
        a: 'A bejegyzések törlésének oka általában a szabályzat megsértése: duplikált tartalom, nem megfelelő kategória, spam, vagy tiltott tartalom. A moderátorok általában üzennek az okról.',
      },
      {
        q: 'Hogyan jelentsek egy szabálysértő bejegyzést?',
        a: 'Minden bejegyzés mellett található egy "Jelentés" gomb (zászló ikon). Kattints rá, adj meg egy rövid indoklást, és a moderátorok megvizsgálják.',
      },
      {
        q: 'Szerkeszthetem a már közzétett bejegyzésemet?',
        a: 'Igen, a saját bejegyzéseid szerkeszthetők a közzétételtől számított 30 percen belül. Utána csak moderátor módosíthat.',
      },
    ],
  },
  {
    id: 'horgaszat',
    label: 'Horgászat & RF4',
    icon: Fish,
    color: '#8ab84d',
    questions: [
      {
        q: 'Mik azok a "Spotok"?',
        a: 'A Spotok a játékban elérhető horgászhelyek. A Spotok oldalon megtalálod az összes helyszín leírását, nehézségi szintjét, az ott fogható halakat és a közösségi értékeléseket.',
      },
      {
        q: 'Hogyan oszthatok meg egy fogást?',
        a: 'Nyiss egy új témát a "Fogások" kategóriában. Töltsd fel a képet, add meg a hal fajtáját, súlyát, a helyszínt és a használt csalit. Minél több részletet adsz meg, annál értékesebb a bejegyzés.',
      },
      {
        q: 'Hol kérhetek segítséget kezdőként?',
        a: 'A "Kezdőknek" chat szobában és a "Tanácsok" kategóriában felteheted kérdéseidet. A közösség szívesen segít minden szinten.',
      },
      {
        q: 'Valósak a fogási rekordok a fórumon?',
        a: 'A fórum szabályzata szerint csak valódi fogásokat szabad megosztani. A manipulált adatok közzététele azonnali kitiltást von maga után.',
      },
    ],
  },
  {
    id: 'moderalas',
    label: 'Moderálás & szabályok',
    icon: ShieldCheck,
    color: '#4ade80',
    questions: [
      {
        q: 'Ki moderálja a fórumot?',
        a: 'A fórumot egy önkéntes moderátor csapat felügyeli, akik aktív tagjai az RF4 magyar közösségnek. Az adminisztrátorokkal a kapcsolat oldalon veheted fel a kapcsolatot.',
      },
      {
        q: 'Mit tegyek, ha úgy érzem, igazságtalanul bántam?',
        a: 'Írj az adminisztrátornak a kapcsolat oldalon. Minden fellebbezést megvizsgálunk. Kérjük, maradj udvarias és adj meg minden releváns információt.',
      },
      {
        q: 'Mennyi ideig tartanak a kitiltások?',
        a: 'Az első figyelmeztetés írásbeli. A második 1–7 napos tiltást vonhat maga után. A harmadik, vagy súlyos esetben azonnali végleges kitiltással jár. Részletek a Szabályzatban.',
      },
    ],
  },
]

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  const t = useTheme()
  return (
    <div style={{ borderBottom: `1px solid ${t.border}` }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.25rem', gap: '1rem', textAlign: 'left' }}
      >
        <span style={{ color: open ? t.text : t.textSec, fontSize: '0.88rem', fontWeight: open ? '600' : '400', lineHeight: 1.5 }}>{q}</span>
        {open ? <ChevronUp size={15} color="#4ade80" style={{ flexShrink: 0 }} /> : <ChevronDown size={15} color={t.textMuted} style={{ flexShrink: 0 }} />}
      </button>
      {open && (
        <div style={{ padding: '0 1.25rem 1rem', color: t.textMuted, fontSize: '0.83rem', lineHeight: 1.7 }}>
          {a}
        </div>
      )}
    </div>
  )
}

function Segitseg() {
  const [activeCategory, setActiveCategory] = useState('altalanos')
  const [search, setSearch] = useState('')
  const t = useTheme()

  const activeSection = categories.find((c) => c.id === activeCategory)

  const filteredQuestions = search.trim()
    ? categories.flatMap((c) => c.questions).filter((q) =>
        q.q.toLowerCase().includes(search.toLowerCase()) ||
        q.a.toLowerCase().includes(search.toLowerCase())
      )
    : activeSection.questions

  return (
    <div style={{ flex: 1, background: t.bg, minHeight: '100vh', padding: '2rem' }}>
      {/* Header */}
      <div style={{ maxWidth: '800px', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
          <HelpCircle size={22} color="#4ade80" />
          <h1 style={{ color: t.text, fontSize: '1.3rem', fontWeight: '700', margin: 0 }}>Segítség & GY.I.K.</h1>
        </div>
        <p style={{ color: t.textMuted, fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          Keresd meg a választ a leggyakoribb kérdésekre, vagy lépj kapcsolatba velünk.
        </p>

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '0.6rem 1rem', maxWidth: '420px' }}>
          <Search size={15} color={t.textMuted} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Keresés a kérdések között..."
            style={{ background: 'none', border: 'none', outline: 'none', color: t.textSec, fontSize: '0.85rem', width: '100%' }}
          />
        </div>
      </div>

      <div style={{ maxWidth: '800px', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* Category sidebar */}
        {!search.trim() && (
          <div style={{ width: '180px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {categories.map(({ id, label, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  background: activeCategory === id ? t.navActiveBg : 'transparent',
                  color: activeCategory === id ? t.navActiveColor : t.textMuted,
                  border: '1px solid ' + (activeCategory === id ? t.navActiveBorder : 'transparent'),
                  borderRadius: '8px', padding: '0.6rem 0.75rem',
                  cursor: 'pointer', textAlign: 'left', fontSize: '0.83rem',
                  fontWeight: activeCategory === id ? '600' : '400',
                  transition: 'background 0.15s',
                }}
              >
                <Icon size={15} color={activeCategory === id ? color : t.textMuted} />
                {label}
              </button>
            ))}
          </div>
        )}

        {/* FAQ list */}
        <div style={{ flex: 1 }}>
          {!search.trim() && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              {(() => { const { icon: Icon, color, label } = activeSection; return <><Icon size={16} color={color} /><h2 style={{ color: t.text, fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>{label}</h2></> })()}
            </div>
          )}

          {search.trim() && (
            <p style={{ color: t.textMuted, fontSize: '0.8rem', marginBottom: '0.75rem' }}>
              {filteredQuestions.length} találat: <strong style={{ color: '#4ade80' }}>"{search}"</strong>
            </p>
          )}

          {filteredQuestions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: t.textDim }}>
              <HelpCircle size={28} style={{ marginBottom: '0.5rem', opacity: 0.3 }} />
              <p style={{ fontSize: '0.85rem' }}>Nem található ilyen kérdés.</p>
            </div>
          ) : (
            <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '12px', overflow: 'hidden' }}>
              {filteredQuestions.map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} />
              ))}
            </div>
          )}

          {/* Contact box */}
          <div style={{ marginTop: '1.25rem', background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <p style={{ color: t.text, fontSize: '0.85rem', fontWeight: '600', margin: '0 0 0.2rem' }}>Nem találtad meg a választ?</p>
              <p style={{ color: t.textMuted, fontSize: '0.78rem', margin: 0 }}>Írj nekünk és 24 órán belül válaszolunk.</p>
            </div>
            <button style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.5rem 1.1rem', fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Kapcsolat
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Segitseg
