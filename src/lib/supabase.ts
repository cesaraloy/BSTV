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

// ─── User actions ──────────────────────────────────────────────────

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function upsertReminder(userId: string, matchId: string, enabled: boolean) {
  if (!supabase) { console.warn('[Reminder] supabase client is null'); return }
  if (!UUID_RE.test(matchId)) {
    console.warn('[Reminder] skipped — matchId is not a UUID (demo data):', matchId)
    return
  }
  const reminderTime = new Date(Date.now() + 30 * 60 * 1000).toISOString()
  console.log('[Reminder] upserting → user:', userId, 'match:', matchId, 'enabled:', enabled)
  const { data, error } = await supabase
    .from('reminders')
    .upsert(
      { user_id: userId, match_id: matchId, enabled, reminder_time: reminderTime },
      { onConflict: 'user_id,match_id' },
    )
    .select()
  if (error) {
    console.error('[Reminder] upsert FAILED:', error.code, error.message, error.details)
  } else {
    console.log('[Reminder] upsert OK:', data)
  }
}

export async function upsertFollowedTeam(userId: string, teamId: string, enabled: boolean) {
  if (!supabase) return
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
  const rows = teams.map(t => ({ user_id: userId, team_id: t.id, enabled: t.enabled }))
  const { error } = await supabase
    .from('user_followed_teams')
    .upsert(rows, { onConflict: 'user_id,team_id' })
  if (error) console.error('saveAllFollowedTeams:', error.message)
}
