import { useState, useCallback } from 'react'
import { demoMatches, demoTeams, demoVenues } from '../data/demo'
import type { Match, Team, Venue } from '../types'

// Simple reactive store using React state lifted to context
export const initialReminders = new Set(['5']) // Inter vs Arsenal has reminder
export const initialFollowedTeams = new Set(['1', '2', '4', '7']) // Real Madrid, Barça, Arsenal, Inter

export function useAppStore() {
  const [matches] = useState<Match[]>(demoMatches)
  const [venues] = useState<Venue[]>(demoVenues)
  const [teams, setTeams] = useState<Team[]>(demoTeams)
  const [reminders, setReminders] = useState<Set<string>>(initialReminders)

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

  return { matches, venues, teams, reminders, toggleReminder, toggleTeam }
}
