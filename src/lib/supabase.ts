import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// ─── Database helpers ──────────────────────────────────────────────

export async function fetchMatches() {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .order('match_date', { ascending: true })
  if (error) { console.error(error); return null }
  return data
}

export async function fetchVenues() {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('venues')
    .select('*')
  if (error) { console.error(error); return null }
  return data
}

export async function fetchTeams() {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .order('name', { ascending: true })
  if (error) { console.error(error); return null }
  return data
}

export async function fetchVenueMatches(venueId?: string) {
  if (!supabase) return null
  let query = supabase.from('venue_matches').select('*')
  if (venueId) query = query.eq('venue_id', venueId)
  const { data, error } = await query
  if (error) { console.error(error); return null }
  return data
}

export async function fetchUserFollowedTeams(userId: string) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('user_followed_teams')
    .select('team_id, enabled')
    .eq('user_id', userId)
  if (error) { console.error(error); return null }
  return data
}

export async function upsertFollowedTeam(userId: string, teamId: string, enabled: boolean) {
  if (!supabase) return null
  const { error } = await supabase
    .from('user_followed_teams')
    .upsert({ user_id: userId, team_id: teamId, enabled }, { onConflict: 'user_id,team_id' })
  if (error) console.error(error)
}

export async function upsertReminder(userId: string, matchId: string, enabled: boolean) {
  if (!supabase) return null
  const reminderTime = new Date(Date.now() - 30 * 60 * 1000).toISOString()
  const { error } = await supabase
    .from('reminders')
    .upsert(
      { user_id: userId, match_id: matchId, enabled, reminder_time: reminderTime },
      { onConflict: 'user_id,match_id' }
    )
  if (error) console.error(error)
}
