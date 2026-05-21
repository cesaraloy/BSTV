import { useState, useCallback, useEffect, useRef } from 'react'
import { demoMatches, demoTeams, demoVenues, venueMatchRelations as demoVenueMatchRelations } from '../data/demo'
import {
  fetchMatches, fetchVenues, fetchTeams, fetchAllVenueMatches,
  fetchUserReminders, fetchUserFollowedTeamIds,
  upsertReminder, upsertFollowedTeam, saveAllFollowedTeams,
  fetchUserProfile, updateUserProfile,
} from './supabase'
import { requestPermission, subscribeToPush, scheduleLocalNotification } from './notifications'
import type { Match, Team, Venue } from '../types'
import type { AuthUser } from './auth'

// ─── localStorage helpers for team preferences ────────────────────
function loadFollowedLocal(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem('bstv-followed-teams') ?? '[]')) }
  catch { return new Set() }
}
function saveFollowedLocal(teams: Team[]) {
  const ids = teams.filter(t => t.enabled).map(t => t.id)
  localStorage.setItem('bstv-followed-teams', JSON.stringify(ids))
}

export function useAppStore() {
  const [matches, setMatches] = useState<Match[]>(demoMatches)
  const [venues, setVenues] = useState<Venue[]>(demoVenues)
  const [teams, setTeams] = useState<Team[]>(demoTeams)
  const [venueMatches, setVenueMatches] = useState<Record<string, string[]>>(demoVenueMatchRelations)
  const [reminders, setReminders] = useState<Set<string>>(new Set(['5']))
  const [theme, setTheme] = useState<'dark' | 'light'>(
    () => (localStorage.getItem('bstv-theme') as 'dark' | 'light') ?? 'dark'
  )
  const [user, setUserState] = useState<AuthUser | null>(null)
  const [userProfile, setUserProfile] = useState<{ name: string; location: string }>({ name: '', location: 'Madrid, España' })
  const [avatarPreset, setAvatarPresetState] = useState<number>(
    () => parseInt(localStorage.getItem('bstv-avatar') ?? '0')
  )
  const [notifAdvance, setNotifAdvanceState] = useState<number>(
    () => parseInt(localStorage.getItem('bstv-notif-advance') ?? '30')
  )
  const [loading, setLoading] = useState(true)
  const userRef = useRef<AuthUser | null>(null)
  const matchesRef = useRef<Match[]>(demoMatches)
  const notifAdvanceRef = useRef<number>(parseInt(localStorage.getItem('bstv-notif-advance') ?? '30'))

  // ── Load public data on mount ────────────────────────────────────
  useEffect(() => {
    async function loadPublicData() {
      const [m, v, t, vm] = await Promise.all([
        fetchMatches(),
        fetchVenues(),
        fetchTeams(),
        fetchAllVenueMatches(),
      ])
      // Only replace demo data if Supabase has rows
      if (m && m.length > 0) { setMatches(m); matchesRef.current = m }
      if (v && v.length > 0) setVenues(v)
      const localFollowed = loadFollowedLocal()
      if (t && t.length > 0) {
        setTeams(t.map(team => ({ ...team, enabled: localFollowed.has(team.id) })))
      } else if (localFollowed.size > 0) {
        // demo teams: restore enabled state from localStorage
        setTeams(prev => prev.map(team => ({ ...team, enabled: localFollowed.has(team.id) })))
      }
      if (vm && Object.keys(vm).length > 0) setVenueMatches(vm)
      setLoading(false)
    }
    loadPublicData()
  }, [])

  // ── Load user-specific data when user logs in ────────────────────
  useEffect(() => {
    if (!user) return
    async function loadUserData() {
      const [userReminders, followedTeamIds, profile] = await Promise.all([
        fetchUserReminders(user!.id),
        fetchUserFollowedTeamIds(user!.id),
        fetchUserProfile(user!.id),
      ])
      if (userReminders.size > 0) setReminders(userReminders)
      // Merge: Supabase wins if it has data, otherwise keep localStorage state
      const localFollowed = loadFollowedLocal()
      const followed = followedTeamIds.size > 0 ? followedTeamIds : localFollowed
      if (followed.size > 0) {
        setTeams(prev => prev.map(t => ({ ...t, enabled: followed.has(t.id) })))
      }
      if (profile) {
        setUserProfile({ name: profile.name ?? '', location: profile.default_location ?? 'Madrid, España' })
        const avatarIdx = parseInt(profile.avatar_url ?? '')
        if (!isNaN(avatarIdx)) {
          setAvatarPresetState(avatarIdx)
          localStorage.setItem('bstv-avatar', String(avatarIdx))
        }
      }
    }
    loadUserData()
  }, [user?.id])

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  // ── Actions ──────────────────────────────────────────────────────
  const setUser = useCallback((u: AuthUser | null) => {
    userRef.current = u
    setUserState(u)
  }, [])

  const toggleReminder = useCallback((matchId: string) => {
    setReminders(prev => {
      const next = new Set(prev)
      const nowEnabled = !next.has(matchId)
      nowEnabled ? next.add(matchId) : next.delete(matchId)

      console.group('[Reminder] toggleReminder')
      console.log('matchId:', matchId)
      console.log('nowEnabled:', nowEnabled)
      console.log('user:', userRef.current?.id ?? 'NOT LOGGED IN')
      console.groupEnd()

      if (userRef.current) {
        upsertReminder(userRef.current.id, matchId, nowEnabled)
      }

      if (nowEnabled) {
        requestPermission().then(async permission => {
          if (permission !== 'granted') return
          if (userRef.current) await subscribeToPush(userRef.current.id)
          const match = matchesRef.current.find(m => m.id === matchId)
          if (match) scheduleLocalNotification(matchId, match.home_team, match.away_team, match.match_time, match.match_date, notifAdvanceRef.current)
        })
      }
      return next
    })
  }, [])

  const toggleTeam = useCallback((teamId: string) => {
    setTeams(prev => {
      const next = prev.map(t => t.id === teamId ? { ...t, enabled: !t.enabled } : t)
      saveFollowedLocal(next)
      const team = next.find(t => t.id === teamId)
      if (userRef.current && team) upsertFollowedTeam(userRef.current.id, teamId, team.enabled)
      return next
    })
  }, [])

  const saveTeams = useCallback((updatedTeams: Team[]) => {
    setTeams(updatedTeams)
    saveFollowedLocal(updatedTeams)
    if (userRef.current) saveAllFollowedTeams(userRef.current.id, updatedTeams)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(t => {
      const next = t === 'dark' ? 'light' : 'dark'
      localStorage.setItem('bstv-theme', next)
      return next
    })
  }, [])

  const saveProfile = useCallback((name: string, location: string) => {
    setUserProfile({ name, location })
    if (userRef.current) updateUserProfile(userRef.current.id, { name, default_location: location })
  }, [])

  const setNotifAdvance = useCallback((minutes: number) => {
    notifAdvanceRef.current = minutes
    setNotifAdvanceState(minutes)
    localStorage.setItem('bstv-notif-advance', String(minutes))
  }, [])

  const setAvatarPreset = useCallback((index: number) => {
    setAvatarPresetState(index)
    localStorage.setItem('bstv-avatar', String(index))
    if (userRef.current) updateUserProfile(userRef.current.id, { avatar_url: String(index) })
  }, [])

  const refreshMatches = useCallback(async () => {
    setLoading(true)
    const m = await fetchMatches()
    if (m && m.length > 0) { setMatches(m); matchesRef.current = m }
    setLoading(false)
  }, [])

  return {
    matches, venues, teams, venueMatches,
    reminders, theme, user, userProfile, avatarPreset, notifAdvance, loading,
    setUser, toggleReminder, toggleTeam, saveTeams, toggleTheme, saveProfile,
    setNotifAdvance, setAvatarPreset, refreshMatches,
  }
}
