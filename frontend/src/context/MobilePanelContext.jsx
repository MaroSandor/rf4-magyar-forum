import { createContext, useContext, useState } from 'react'

const MobilePanelContext = createContext()

export function MobilePanelProvider({ children }) {
  const [chatOpen, setChatOpen] = useState(false)
  return (
    <MobilePanelContext.Provider value={{ chatOpen, setChatOpen }}>
      {children}
    </MobilePanelContext.Provider>
  )
}

export const useMobilePanel = () => useContext(MobilePanelContext)
