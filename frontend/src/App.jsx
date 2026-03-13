import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import RightPanel from './components/RightPanel'
import Fooldal from './pages/Fooldal'
import Forum from './pages/Forum'
import Login from './pages/Login'
import Ertesitesek from './pages/Ertesitesek'
import Spotok from './pages/Spotok'
import Szabalyzat from './pages/Szabalyzat'
import Segitseg from './pages/Segitseg'
import Fogasok from './pages/Fogasok'
import NotFound from './pages/NotFound'
import Register from './pages/Register'
import { useTheme } from './context/ThemeContext'

function App() {
  const t = useTheme()
  return (
    <div style={{ display: 'flex', background: t.bg, minHeight: '100vh', color: t.text }}>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Fooldal />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/spotok" element={<Spotok />} />
        <Route path="/rules" element={<Szabalyzat />} />
        <Route path="/help" element={<Segitseg />} />
        <Route path="/fogasok" element={<Fogasok />} />
        <Route path="/notifications" element={<Ertesitesek />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <RightPanel />
    </div>
  )
}

export default App
