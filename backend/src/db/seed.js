// seed.js — teszt adatok feltöltése
// Futtatás: node src/db/seed.js
//
// A seed szkript törli és újra feltölti az összes táblát,
// így mindig tiszta állapotból indul a fejlesztés.

const bcrypt = require('bcrypt')
const { db, sqlite } = require('./index')
const { users } = require('./schema/users')
const { temak, hozzaszolasok } = require('./schema/temak')
const { fogasok } = require('./schema/fogasok')
const { spotok } = require('./schema/spotok')
const { ertesitesek } = require('./schema/ertesitesek')

// Táblákat kézzel hozzuk létre (migration helyett egyszerűbb fejlesztési fázisban)
function createTables() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      level INTEGER NOT NULL DEFAULT 1,
      points INTEGER NOT NULL DEFAULT 0,
      avatar_color TEXT NOT NULL DEFAULT '#4ade80',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS temak (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL,
      category_color TEXT NOT NULL DEFAULT '#4ade80',
      votes INTEGER NOT NULL DEFAULT 0,
      comment_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS hozzaszolasok (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tema_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      votes INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS fogasok (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      halfaj TEXT NOT NULL,
      suly REAL NOT NULL,
      hossz REAL,
      spot TEXT,
      csali TEXT,
      melyseg REAL,
      idojaras TEXT,
      fogas_ideje TEXT,
      leiras TEXT,
      tags TEXT,
      votes INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS spotok (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nev TEXT NOT NULL,
      regio TEXT NOT NULL,
      leiras TEXT,
      nehezseg TEXT NOT NULL DEFAULT 'Kezdő',
      nehezseg_szin TEXT NOT NULL DEFAULT '#2d9c8a',
      ertekeles REAL NOT NULL DEFAULT 0,
      aktiv_felh INTEGER NOT NULL DEFAULT 0,
      halfajok TEXT NOT NULL DEFAULT '[]',
      tags TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS ertesitesek (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      from_user_id INTEGER,
      type TEXT NOT NULL,
      text TEXT NOT NULL,
      detail TEXT,
      read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `)
}

function clearTables() {
  sqlite.exec(`
    DELETE FROM ertesitesek;
    DELETE FROM hozzaszolasok;
    DELETE FROM fogasok;
    DELETE FROM temak;
    DELETE FROM spotok;
    DELETE FROM users;
    DELETE FROM sqlite_sequence WHERE name IN ('users','temak','hozzaszolasok','fogasok','spotok','ertesitesek');
  `)
  console.log('Táblák törölve.')
}

function seedUsers() {
  // bcrypt.hashSync() — szinkron verzió, seed szkripthez megfelelő
  // Élesben mindig az aszinkron bcrypt.hash()-t használd
  const hash = (pw) => bcrypt.hashSync(pw, 10)

  const now = new Date().toISOString()
  db.insert(users).values([
    { username: 'NagyFogás',      email: 'nagy@rf4.hu',      passwordHash: hash('jelszo123'), role: 'user',      level: 8,  points: 120, avatarColor: '#4ade80', createdAt: now },
    { username: 'MesterHorgász',  email: 'mester@rf4.hu',    passwordHash: hash('jelszo123'), role: 'moderator', level: 7,  points: 114, avatarColor: '#2d9c8a', createdAt: now },
    { username: 'TapasztaltZoli', email: 'zoli@rf4.hu',      passwordHash: hash('jelszo123'), role: 'user',      level: 6,  points: 109, avatarColor: '#8ab84d', createdAt: now },
    { username: 'HorgászPéter',   email: 'peter@rf4.hu',     passwordHash: hash('jelszo123'), role: 'user',      level: 5,  points: 95,  avatarColor: '#c8a87a', createdAt: now },
    { username: 'RecordHunter',   email: 'record@rf4.hu',    passwordHash: hash('jelszo123'), role: 'user',      level: 5,  points: 90,  avatarColor: '#8ab84d', createdAt: now },
    { username: 'UjHorgász99',    email: 'ujhorgasz@rf4.hu', passwordHash: hash('jelszo123'), role: 'user',      level: 1,  points: 12,  avatarColor: '#2d9c8a', createdAt: now },
    { username: 'VolgaKing',      email: 'volga@rf4.hu',     passwordHash: hash('jelszo123'), role: 'user',      level: 9,  points: 210, avatarColor: '#2d9c8a', createdAt: now },
    { username: 'Admin',          email: 'admin@rf4.hu',     passwordHash: hash('admin1234'), role: 'admin',     level: 10, points: 999, avatarColor: '#f87171', createdAt: now },
  ]).run()
  console.log('Felhasználók betöltve.')
}

function seedSpotok() {
  const now = new Date().toISOString()
  db.insert(spotok).values([
    {
      nev: 'Mosquito Lake', regio: 'Oroszország', nehezseg: 'Kezdő', nehezsegSzin: '#2d9c8a',
      leiras: 'Tökéletes hely kezdőknek. Sekély vizek, sok hal, könnyen megközelíthető.',
      ertekeles: 4.2, aktivFelh: 34,
      halfajok: JSON.stringify(['Csuka', 'Sügér', 'Ponty']),
      tags: JSON.stringify(['kezdő', 'ponty', 'csuka']), createdAt: now,
    },
    {
      nev: 'Winding Rivulet', regio: 'Oroszország', nehezseg: 'Kezdő', nehezsegSzin: '#2d9c8a',
      leiras: 'Csendes kis folyó, ideális lazac- és pisztrángos horgászathoz.',
      ertekeles: 3.8, aktivFelh: 18,
      halfajok: JSON.stringify(['Pisztráng', 'Folyami sügér']),
      tags: JSON.stringify(['folyó', 'pisztráng']), createdAt: now,
    },
    {
      nev: 'Belaya River', regio: 'Baskíria', nehezseg: 'Közepes', nehezsegSzin: '#2d9c8a',
      leiras: 'Változatos halfajok, erős sodrás. Tapasztalt horgászoknak ajánlott.',
      ertekeles: 4.5, aktivFelh: 56,
      halfajok: JSON.stringify(['Harcsa', 'Csuka', 'Kecsege']),
      tags: JSON.stringify(['folyó', 'harcsa', 'verseny']), createdAt: now,
    },
    {
      nev: 'Ladoga Lake', regio: 'Karélia', nehezseg: 'Közepes', nehezsegSzin: '#2d9c8a',
      leiras: 'Európa legnagyobb tava. Hatalmas halfajta-választék, időjárás befolyásolja.',
      ertekeles: 4.7, aktivFelh: 89,
      halfajok: JSON.stringify(['Lazac', 'Tőkehal', 'Harcsa']),
      tags: JSON.stringify(['tó', 'lazac', 'nagy hal']), createdAt: now,
    },
    {
      nev: 'Sura River', regio: 'Volga vidék', nehezseg: 'Haladó', nehezsegSzin: '#f87171',
      leiras: 'A legnehezebb és legjutalmazóbb spot. Rekordméretek lehetségesek.',
      ertekeles: 4.9, aktivFelh: 41,
      halfajok: JSON.stringify(['Viza', 'Harcsa', 'Süllő']),
      tags: JSON.stringify(['folyó', 'rekord', 'haladó']), createdAt: now,
    },
    {
      nev: 'Volga River Delta', regio: 'Asztrahán', nehezseg: 'Haladó', nehezsegSzin: '#f87171',
      leiras: 'Legendás horgászhely. A legnagyobb halfajták itt találhatók.',
      ertekeles: 4.8, aktivFelh: 73,
      halfajok: JSON.stringify(['Harcsa', 'Ponty', 'Süllő', 'Viza']),
      tags: JSON.stringify(['delta', 'rekord', 'harcsa']), createdAt: now,
    },
  ]).run()
  console.log('Spotok betöltve.')
}

function seedTemak() {
  const now = new Date().toISOString()
  db.insert(temak).values([
    { userId: 2, title: 'Hol érdemes mostanában a Ladogán horgászni?', content: 'Sziasztok! Nemrég voltam a Ladogán és a keleti parton remek eredményeket értem el. Ti mit tapasztaltatok az utóbbi hetekben? Melyik spot a legjobb mostanában?', category: 'Horgászhelyek', categoryColor: '#4ade80', votes: 25, commentCount: 24, createdAt: now },
    { userId: 3, title: 'Teljesen megéri a prémium csali — 3 hetes teszt eredményei', content: 'Kipróbáltam a prémium csomagot és meglepő eredményeket kaptam. Összehasonlítottam az alap csalival mindkét esetben mért fogásszámot. Részletes statisztikák a posztban!', category: 'Felszerelések', categoryColor: '#2d9c8a', votes: 21, commentCount: 32, createdAt: now },
    { userId: 6, title: 'Ezeket a helyeket kerüljétek el tavasszal ;(', content: 'Sajnos rossz tapasztalataim vannak pár spottal tavasszal. Megosztom veletek, hogy ne tegyétek ugyanazt a hibát mint én. Főleg a sekély vizeket kerüljétek!', category: 'Tanácsok', categoryColor: '#c8a87a', votes: 22, commentCount: 18, createdAt: now },
    { userId: 1, title: '15kg-os harcsa a Svirből — képekkel!', content: 'Végre sikerült! Hajnali 5-kor indultam el, élő csalival próbálkoztam. A mély részen, 8 méteres vízben akadt meg. Közel 2 óra harc után sikerült kiemelni. Képek a posztban!', category: 'Fogások', categoryColor: '#8ab84d', votes: 38, commentCount: 55, createdAt: now },
    { userId: 4, title: 'Kezdőknek: milyen felszerelést vegyek először?', content: 'Nemrég kezdtem el az RF4-et és fogalmam sincs melyik botot és orsót vegyem először. Mennyi aranyból ki lehet jönni? Segítsetek!', category: 'Kérdések', categoryColor: '#38bdf8', votes: 15, commentCount: 41, createdAt: now },
    { userId: 5, title: 'Verseny: ki fogja a legnagyobb harcsát márciusban?', content: 'Kis baráti verseny indul! Március végéig ki fogja a legnagyobb harcsát? Írjátok a fogásaitokat ebbe a témába! Becsület alapon működik.', category: 'Horgászhelyek', categoryColor: '#4ade80', votes: 30, commentCount: 12, createdAt: now },
    { userId: 7, title: 'Viza horgászat tippek — Volga Delta tapasztalatok', content: 'Már 3 éve járok a Volga Deltára vizáért. Megosztom a legjobb tippjeimet: időpont, csali, technika. Ez a poszt minden vizás horgásznak kötelező olvasmány.', category: 'Tanácsok', categoryColor: '#c8a87a', votes: 44, commentCount: 67, createdAt: now },
    { userId: 3, title: 'Ladoga tó téli horgászat — mit kell tudni?', content: 'Télen is érdemes a Ladogán próbálkozni? Tapasztalatok, tippek, trükkök? Hallottam hogy télen más halfajok kerülnek előtérbe.', category: 'Horgászhelyek', categoryColor: '#4ade80', votes: 17, commentCount: 23, createdAt: now },
  ]).run()
  console.log('Témák betöltve.')
}

function seedHozzaszolasok() {
  const now = new Date().toISOString()
  db.insert(hozzaszolasok).values([
    { temaId: 1, userId: 1, content: 'A keleti parton, a nagy szikláknál próbáltam szerencsét. Nagyon jól ment a lazac!', votes: 8, createdAt: now },
    { temaId: 1, userId: 3, content: 'Én a déli parton voltam, ott meg a tőkehal ment nagyon. Érdemes mindkét részt kipróbálni.', votes: 5, createdAt: now },
    { temaId: 1, userId: 5, content: 'Hajnalban a legjobb, nappal szinte semmi nem harap.', votes: 12, createdAt: now },
    { temaId: 2, userId: 1, content: 'Én is kipróbáltam, tényleg megéri a prémium csali!', votes: 6, createdAt: now },
    { temaId: 2, userId: 6, content: 'Köszönöm a részletes összehasonlítást, sokat segített!', votes: 3, createdAt: now },
    { temaId: 4, userId: 2, content: 'Gratulálok! Én is próbálkoztam már harcsával de ilyen nagyot még nem fogtam.', votes: 15, createdAt: now },
    { temaId: 4, userId: 3, content: 'Melyik mélységből jött? Élő csalit használtál végig?', votes: 4, createdAt: now },
    { temaId: 4, userId: 7, content: 'Szép fogás! A Svirben én is láttam már ekkora példányokat.', votes: 9, createdAt: now },
  ]).run()
  console.log('Hozzászólások betöltve.')
}

function seedFogasok() {
  const now = new Date().toISOString()
  db.insert(fogasok).values([
    { userId: 1, halfaj: 'Harcsa', suly: 38.5, hossz: 142, spot: 'Volga River Delta', csali: 'Élő csali (ponty)', melyseg: 6.5, idojaras: 'Felhős', fogasIdeje: '2026-03-12 06:30', leiras: 'Hajnal előtt 30 perccel vettem a merülőt. Közel egy órás harc után sikerült kiemelni.', tags: JSON.stringify(['rekord', 'harcsa']), votes: 47, createdAt: now },
    { userId: 2, halfaj: 'Lazac', suly: 14.2, hossz: 98, spot: 'Ladoga Lake', csali: 'Villantó (ezüst)', melyseg: 3.2, idojaras: 'Napos', fogasIdeje: '2026-03-11 14:15', leiras: 'A keleti parton, a sziklák közelében akadt. Három dobásra jött az első harapás.', tags: JSON.stringify(['lazac', 'ladoga']), votes: 31, createdAt: now },
    { userId: 5, halfaj: 'Csuka', suly: 11.8, hossz: 103, spot: 'Belaya River', csali: 'Wobbler (zöld)', melyseg: 1.8, idojaras: 'Szeles', fogasIdeje: '2026-03-10 09:00', leiras: 'A folyókanyarulatnál, sekély vízben fogott. Wobblerre azonnal rávágott.', tags: JSON.stringify(['csuka', 'folyó']), votes: 28, createdAt: now },
    { userId: 3, halfaj: 'Ponty', suly: 8.4, hossz: 74, spot: 'Mosquito Lake', csali: 'Kukorica', melyseg: 2.1, idojaras: 'Napos', fogasIdeje: '2026-03-09 11:45', leiras: 'Klasszikus kukoricás módszer, türelemmel. Másfél óra várakozás után jött.', tags: JSON.stringify(['ponty', 'kezdő']), votes: 19, createdAt: now },
    { userId: 4, halfaj: 'Kecsege', suly: 5.9, hossz: 61, spot: 'Belaya River', csali: 'Giliszta', melyseg: 4.5, idojaras: 'Borult', fogasIdeje: '2026-03-08 17:30', leiras: 'Ritka fogás, nagyon örültem neki! A folyó közepén, mély részen volt.', tags: JSON.stringify(['ritka', 'kecsege']), votes: 22, createdAt: now },
    { userId: 6, halfaj: 'Pisztráng', suly: 2.3, hossz: 42, spot: 'Winding Rivulet', csali: 'Szárazlégy', melyseg: 0.8, idojaras: 'Napos', fogasIdeje: '2026-03-07 08:00', leiras: 'Az első komolyabb pisztrángom! Légypiszkálással, a sebesebb részen.', tags: JSON.stringify(['pisztráng', 'kezdő']), votes: 15, createdAt: now },
    { userId: 7, halfaj: 'Viza', suly: 31.2, hossz: 198, spot: 'Volga River Delta', csali: 'Élő csali (keszeg)', melyseg: 9.0, idojaras: 'Felhős', fogasIdeje: '2026-03-05 04:00', leiras: 'Hajnali horgászat, a legjobb időpont vizára. Rekord méretű példány volt!', tags: JSON.stringify(['rekord', 'viza', 'delta']), votes: 63, createdAt: now },
    { userId: 1, halfaj: 'Harcsa', suly: 22.1, hossz: 118, spot: 'Sura River', csali: 'Élő csali (ponty)', melyseg: 7.0, idojaras: 'Borult', fogasIdeje: '2026-03-03 05:45', leiras: 'A Sura folyón próbálkoztam. Borult időben a harcsa aktívabb szokott lenni.', tags: JSON.stringify(['harcsa', 'folyó']), votes: 34, createdAt: now },
  ]).run()
  console.log('Fogások betöltve.')
}

function seedErtesitesek() {
  const now = new Date().toISOString()
  db.insert(ertesitesek).values([
    { userId: 1, fromUserId: 2, type: 'reply', text: 'válaszolt a hozzászólásodra:', detail: '"Szerintem a Svir folyón a legjobb helyek..."', read: 0, createdAt: now },
    { userId: 1, fromUserId: 3, type: 'like',  text: 'kedvelte a bejegyzésedet:', detail: '"15kg-os harcsa a Ladogából!"', read: 0, createdAt: now },
    { userId: 1, fromUserId: 6, type: 'follow', text: 'követni kezdett téged.', detail: null, read: 0, createdAt: now },
    { userId: 1, fromUserId: 4, type: 'reply', text: 'válaszolt a hozzászólásodra:', detail: '"Én ezzel a bottal próbálkoztam..."', read: 1, createdAt: now },
    { userId: 1, fromUserId: 5, type: 'like',  text: 'kedvelte a bejegyzésedet:', detail: '"Tippek kezdőknek a Volga-deltán"', read: 1, createdAt: now },
    { userId: 1, fromUserId: 1, type: 'follow', text: 'követni kezdett téged.', detail: null, read: 1, createdAt: now },
  ]).run()
  console.log('Értesítések betöltve.')
}

// --- Futtatás ---
try {
  console.log('Seed indítása...')
  createTables()
  clearTables()
  seedUsers()
  seedSpotok()
  seedTemak()
  seedHozzaszolasok()
  seedFogasok()
  seedErtesitesek()
  console.log('\nSeed sikeresen lefutott!')
} catch (err) {
  console.error('Seed hiba:', err)
  process.exit(1)
}
