import { useState, useCallback, useEffect } from 'react'
import { demoMatches, demoTeams, demoVenues } from '../data/demo'
import type { Match, Team, Venue } from '../types'

export const initialReminders = new Set(['5'])
export const initialFollowedTeams = new Set(['1', '2', '4', '7'])

export function useAppStore() {
  const [matches] = useState<Match[]>(demoMatches)
  const [venues] = useState<Venue[]>(demoVenues)
  const [teams, setTeams] = useState<Team[]>(demoTeams)
  const [reminders, setReminders] = useState<Set<string>>(initialReminders)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
    }
  }, [theme])

  const toggleReminder = useCallback((matchId: string) => {
    setReminders(prev => {
      const next = new Set(prev)
      if (next.has(matchId)) next.delete(matchId)
      else next.add(matchId)
      return next
    })
  }, [])

  const toggleTeam = useCallback((teamId: string) => {
    setTeams(prev =>
      prev.map(t => t.id === teamId ? { ...t, enabled: !t.enabled } : t)
    )
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }, [])

  return { matches, venues, teams, reminders, theme, toggleReminder, toggleTeam, toggleTheme }
}
