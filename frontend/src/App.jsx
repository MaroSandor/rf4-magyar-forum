import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import RightPanel from './components/RightPanel'
import MobileTopBar from './components/MobileTopBar'
import Fooldal from './pages/Fooldal'
import Forum from './pages/Forum'
import Login from './pages/Login'
import Register from './pages/Register'
import Ertesitesek from './pages/Ertesitesek'
import Spotok from './pages/Spotok'
import Szabalyzat from './pages/Szabalyzat'
import Segitseg from './pages/Segitseg'
import Fogasok from './pages/Fogasok'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'
import { useTheme } from './context/ThemeContext'
import { useAuth } from './context/AuthContext'
import { useIsMobile } from './hooks/useIsMobile'

function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

function App() {
  const t = useTheme()
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: t.bg, minHeight: '100vh', color: t.text }}>
      {isMobile && <MobileTopBar onMenuClick={() => setSidebarOpen(true)} />}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar isMobile={isMobile} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
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
            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        {!isMobile && <RightPanel />}
      </div>
    </div>
  )
}

export default App
