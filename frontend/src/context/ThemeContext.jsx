import { createContext, useContext, useState } from 'react'

const dark = {
  isDark: true,
  bg: '#0f172a',
  bgCard: '#1e293b',
  bgRaised: '#263548',
  border: '#334155',
  borderFocus: '#2d5a8f',
  text: '#f8fafc',
  textSec: '#94a3b8',
  textMuted: '#64748b',
  textDim: '#475569',
  navActiveBg: '#1e3a5f',
  navActiveBorder: '#2d5a8f',
  navActiveColor: '#38bdf8',
  filterActiveBg: '#1e3a5f',
  filterActiveBorder: '#2d5a8f',
  filterActiveColor: '#4ade80',
  green: '#4ade80',
  greenBtn: '#22c55e',
  greenBtnDark: '#16a34a',
  blue: '#38bdf8',
  gold: '#d4a064',
  rank1Bg: '#2d2010',
  rank1Border: '#d4a064',
  unreadBg: '#263548',
  unreadBorder: '#1e3a5f',
  bannerBg: 'linear-gradient(135deg, #0a0f1e 0%, #0f1e38 50%, #0a1528 100%)',
  bannerGlow: 'radial-gradient(ellipse at 80% 50%, rgba(56,189,248,0.1) 0%, transparent 60%)',
  spotCardHeader: 'linear-gradient(135deg, #0f172a, #1e293b)',
  modalBg: '#1e293b',
  modalHeader: 'linear-gradient(135deg, #1e293b, #1e3a5f)',
  modalDetailBg: '#0f172a',
  fishPlaceholderBg: 'linear-gradient(135deg, #263548, #1e3a5f)',
  fishPlaceholderIcon: '#2d5a8f',
  weeklyBestBg: 'linear-gradient(135deg, #1e293b, #1e3a5f)',
  weeklyBestBorder: '#2d5a8f',
}

const light = {
  isDark: false,
  bg: '#d6dde8',
  bgCard: '#dfe6f0',
  bgRaised: '#e8eef6',
  border: '#bcc8d8',
  borderFocus: '#7aaed4',
  text: '#1e293b',
  textSec: '#374558',
  textMuted: '#5a7080',
  textDim: '#8099aa',
  navActiveBg: '#c8d8ea',
  navActiveBorder: '#7aaed4',
  navActiveColor: '#1a6fa8',
  filterActiveBg: '#c8ddd0',
  filterActiveBorder: '#6aaa8a',
  filterActiveColor: '#1a6e44',
  green: '#1a6e44',
  greenBtn: '#22c55e',
  greenBtnDark: '#16a34a',
  blue: '#1a6fa8',
  gold: '#8a5c1a',
  rank1Bg: '#e8dfc8',
  rank1Border: '#c8a855',
  unreadBg: '#cdd8e8',
  unreadBorder: '#7aaed4',
  bannerBg: 'linear-gradient(135deg, #b8c8d8 0%, #c0cedc 50%, #b8c8d4 100%)',
  bannerGlow: 'radial-gradient(ellipse at 80% 50%, rgba(26,111,168,0.1) 0%, transparent 60%)',
  spotCardHeader: 'linear-gradient(135deg, #d6dde8, #dfe6f0)',
  modalBg: '#dfe6f0',
  modalHeader: 'linear-gradient(135deg, #cdd8e8, #c8d8ea)',
  modalDetailBg: '#d6dde8',
  fishPlaceholderBg: 'linear-gradient(135deg, #c8d8ea, #bccde0)',
  fishPlaceholderIcon: '#7aaed4',
  weeklyBestBg: 'linear-gradient(135deg, #cdd8e8, #c8d8ea)',
  weeklyBestBorder: '#7aaed4',
}

export const ThemeContext = createContext({ ...dark, toggle: () => {} })

export const useTheme = () => useContext(ThemeContext)

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true)
  const theme = isDark ? dark : light
  return (
    <ThemeContext.Provider value={{ ...theme, toggle: () => setIsDark((d) => !d) }}>
      {children}
    </ThemeContext.Provider>
  )
}
