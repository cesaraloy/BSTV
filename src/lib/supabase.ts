import { createClient } from '@supabase/supabase-js'
import type { Match, Venue, Team } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// ─── Public data ───────────────────────────────────────────────────

export async function fetchMatches(): Promise<Match[] | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .order('match_date', { ascending: true })
  if (error) { console.error('fetchMatches:', error.message); return null }
  return data as Match[]
}

export async function fetchVenues(): Promise<Venue[] | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from('venues').select('*')
  if (error) { console.error('fetchVenues:', error.message); return null }
  // competitions may be stored as comma string in some CSV imports
  return (data as Venue[]).map(v => ({
    ...v,
    competitions: Array.isArray(v.competitions)
      ? v.competitions
      : String(v.competitions ?? '').split(',').map(s => s.trim()).filter(Boolean),
  }))
}

export async function fetchTeams(): Promise<Team[] | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .order('name', { ascending: true })
  if (error) { console.error('fetchTeams:', error.message); return null }
  return data as Team[]
}

export async function fetchAllVenueMatches(): Promise<Record<string, string[]> | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from('venue_matches').select('venue_id, match_id')
  if (error) { console.error('fetchVenueMatches:', error.message); return null }
  const map: Record<string, string[]> = {}
  for (const row of data) {
    if (!map[row.venue_id]) map[row.venue_id] = []
    map[row.venue_id].push(row.match_id)
  }
  return map
}

// ─── User-specific data ────────────────────────────────────────────

export async function fetchUserReminders(userId: string): Promise<Set<string>> {
  if (!supabase) return new Set()
  const { data, error } = await supabase
    .from('reminders')
    .select('match_id')
    .eq('user_id', userId)
    .eq('enabled', true)
  if (error) { console.error('fetchReminders:', error.message); return new Set() }
  return new Set(data.map(r => r.match_id))
}

export async function fetchUserFollowedTeamIds(userId: string): Promise<Set<string>> {
  if (!supabase) return new Set()
  const { data, error } = await supabase
    .from('user_followed_teams')
    .select('team_id')
    .eq('user_id', userId)
    .eq('enabled', true)
  if (error) { console.error('fetchFollowedTeams:', error.message); return new Set() }
  return new Set(data.map(r => r.team_id))
}

// ─── User profile ──────────────────────────────────────────────────

export async function fetchUserProfile(userId: string): Promise<{ name: string; default_location: string; avatar_url: string } | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('users')
    .select('name, default_location, avatar_url')
    .eq('id', userId)
    .single()
  if (error) { console.error('fetchUserProfile:', error.message); return null }
  return data
}

export async function updateUserProfile(userId: string, fields: { name?: string; default_location?: string; avatar_url?: string }) {
  if (!supabase) return
  console.log('[Supabase] updateUserProfile fields:', fields, 'userId:', userId)
  const { error, data } = await supabase.from('users').update(fields).eq('id', userId).select('id, name')
  if (error) console.error('[Supabase] updateUserProfile FAILED:', error.code, error.message, error.details)
  else console.log('[Supabase] updateUserProfile OK:', data)
}

export async function uploadAvatar(userId: string, file: File): Promise<string | null> {
  if (!supabase) return null
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `avatars/${userId}.${ext}`
  const { error } = await supabase.storage
    .from('images')
    .upload(path, file, { upsert: true, contentType: file.type })
  if (error) { console.error('uploadAvatar:', error.message); return null }
  const { data } = supabase.storage.from('images').getPublicUrl(path)
  return data.publicUrl
}

// ─── User actions ──────────────────────────────────────────────────

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function upsertReminder(
  userId: string,
  matchId: string,
  enabled: boolean,
  matchDatetime?: string | null,
  advanceMinutes = 30,
) {
  if (!supabase) { console.warn('[Reminder] supabase client is null'); return }
  if (!UUID_RE.test(matchId)) {
    console.warn('[Reminder] skipped — matchId is not a UUID (demo data):', matchId)
    return
  }
  // Compute the actual UTC time to send the notification
  const reminderTime = matchDatetime
    ? new Date(new Date(matchDatetime).getTime() - advanceMinutes * 60_000).toISOString()
    : null

  const { error } = await supabase
    .from('reminders')
    .upsert(
      { user_id: userId, match_id: matchId, enabled, reminder_time: reminderTime, sent: false, notif_advance: advanceMinutes },
      { onConflict: 'user_id,match_id' },
    )
  if (error) console.error('[Reminder] upsert FAILED:', error.code, error.message)
}

export async function upsertFollowedTeam(userId: string, teamId: string, enabled: boolean) {
  if (!supabase) return
  if (!UUID_RE.test(teamId)) return // skip demo string IDs
  const { error } = await supabase
    .from('user_followed_teams')
    .upsert(
      { user_id: userId, team_id: teamId, enabled },
      { onConflict: 'user_id,team_id' },
    )
  if (error) console.error('upsertFollowedTeam:', error.message)
}

export async function saveAllFollowedTeams(userId: string, teams: Team[]) {
  if (!supabase) return
  const rows = teams
    .filter(t => UUID_RE.test(t.id)) // skip demo string IDs
    .map(t => ({ user_id: userId, team_id: t.id, enabled: t.enabled }))
  if (rows.length === 0) return
  const { error } = await supabase
    .from('user_followed_teams')
    .upsert(rows, { onConflict: 'user_id,team_id' })
  if (error) console.error('saveAllFollowedTeams:', error.message)
}
