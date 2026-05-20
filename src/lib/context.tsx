import React, { createContext, useContext } from 'react'
import { useAppStore } from './store'
import type { Match, Team, Venue } from '../types'

interface AppContextType {
  matches: Match[]
  venues: Venue[]
  teams: Team[]
  reminders: Set<string>
  theme: 'dark' | 'light'
  toggleReminder: (matchId: string) => void
  toggleTeam: (teamId: string) => void
  toggleTheme: () => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const store = useAppStore()
  return <AppContext.Provider value={store}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
