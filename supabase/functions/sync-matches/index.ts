// Supabase Edge Function: sync-matches
// Triggered daily at 01:00 UTC by pg_cron (see sync_setup.sql).
// Fetches upcoming matches from football-data.org and upserts them
// into the matches table, keyed by external_id to avoid duplicates.

import { createClient } from 'jsr:@supabase/supabase-js@2'

const FOOTBALL_API_KEY     = Deno.env.get('FOOTBALL_DATA_API_KEY') ?? ''
const FOOTBALL_API_BASE    = 'https://api.football-data.org/v4'
const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const COMPETITIONS = [
  { code: 'PD', name: 'LaLiga',           emoji: '🇪🇸' },
  { code: 'PL', name: 'Premier League',   emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { code: 'CL', name: 'Champions League', emoji: '⭐' },
  { code: 'EL', name: 'Europa League',    emoji: '🏆' },
]

// Maps football-data.org team names to BSTV Spanish-style names
const TEAM_NAME_MAP: Record<string, string> = {
  // LaLiga
  'Real Madrid CF':               'Real Madrid',
  'FC Barcelona':                 'FC Barcelona',
  'Club Atlético de Madrid':      'Atlético de Madrid',
  'Athletic Club':                'Athletic Club',
  'Villarreal CF':                'Villarreal CF',
  'Real Sociedad de Fútbol':      'Real Sociedad',
  'Real Betis Balompié':          'Real Betis',
  'Sevilla FC':                   'Sevilla FC',
  'Girona FC':                    'Girona FC',
  'RC Celta de Vigo':             'RC Celta',
  'CA Osasuna':                   'CA Osasuna',
  'Rayo Vallecano de Madrid':     'Rayo Vallecano',
  'Getafe CF':                    'Getafe CF',
  'Valencia CF':                  'Valencia CF',
  'RCD Espanyol de Barcelona':    'RCD Espanyol',
  'RCD Mallorca':                 'RCD Mallorca',
  'Deportivo Alavés':             'Deportivo Alavés',
  'Real Valladolid CF':           'Real Valladolid',
  'UD Las Palmas':                'UD Las Palmas',
  'CD Leganés':                   'CD Leganés',
  // Premier League
  'Arsenal FC':                   'Arsenal',
  'Chelsea FC':                   'Chelsea',
  'Liverpool FC':                 'Liverpool',
  'Manchester City FC':           'Manchester City',
  'Manchester United FC':         'Manchester United',
  'Tottenham Hotspur FC':         'Tottenham Hotspur',
  'Newcastle United FC':          'Newcastle United',
  'Aston Villa FC':               'Aston Villa',
  'West Ham United FC':           'West Ham United',
  'Brighton & Hove Albion FC':    'Brighton',
  'Brentford FC':                 'Brentford',
  'Wolverhampton Wanderers FC':   'Wolverhampton',
  'Crystal Palace FC':            'Crystal Palace',
  'Fulham FC':                    'Fulham',
  'Everton FC':                   'Everton',
  'Nottingham Forest FC':         'Nottingham Forest',
  'AFC Bournemouth':              'Bournemouth',
  'Leicester City FC':            'Leicester City',
  'Ipswich Town FC':              'Ipswich Town',
  'Southampton FC':               'Southampton',
  // Champions League / Europa League
  'FC Bayern München':            'Bayern Múnich',
  'Borussia Dortmund':            'Borussia Dortmund',
  'Bayer 04 Leverkusen':          'Bayer Leverkusen',
  'RB Leipzig':                   'RB Leipzig',
  'Paris Saint-Germain FC':       'PSG',
  'AS Monaco FC':                 'Monaco',
  'LOSC Lille':                   'Lille',
  'FC Internazionale Milano':     'Inter de Milán',
  'Inter Milan':                  'Inter de Milán',
  'AC Milan':                     'AC Milan',
  'Juventus FC':                  'Juventus',
  'Atalanta BC':                  'Atalanta',
  'SL Benfica':                   'Benfica',
  'Sporting CP':                  'Sporting CP',
  'FC Porto':                     'Porto',
  'AFC Ajax':                     'Ajax',
  'PSV Eindhoven':                'PSV',
  'Feyenoord Rotterdam':          'Feyenoord',
  'SS Lazio':                     'Lazio',
  'ACF Fiorentina':               'Fiorentina',
  'AS Roma':                      'AS Roma',
  'SSC Napoli':                   'Napoli',
  'Eintracht Frankfurt':          'Eintracht Frankfurt',
  'Olympique de Marseille':       'Olympique de Marseille',
  'Olympique Lyonnais':           'Olympique Lyon',
  'Fenerbahçe SK':                'Fenerbahçe',
  'Galatasaray A.Ş.':             'Galatasaray',
}

function normalizeTeamName(apiName: string, shortName: string): string {
  return TEAM_NAME_MAP[apiName] ?? TEAM_NAME_MAP[shortName] ?? shortName ?? apiName
}

function matchDateLabel(utcDate: string): string {
  const matchDate = new Date(utcDate)
  const fmt = (d: Date) =>
    new Intl.DateTimeFormat('es-ES', {
      timeZone: 'Europe/Madrid',
      year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(d)

  const now      = new Date()
  const today    = fmt(now)
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const matchStr = fmt(matchDate)
  if (matchStr === today) return 'HOY'
  if (matchStr === fmt(tomorrow)) return 'MAÑANA'

  // es-ES format is DD/MM/YYYY — return DD/MM
  const [day, month] = matchStr.split('/')
  return `${day}/${month}`
}

function matchTimeLabel(utcDate: string): string {
  return new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(utcDate))
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  if (!FOOTBALL_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'FOOTBALL_DATA_API_KEY secret not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  const now      = new Date()
  const dateFrom = now.toISOString().split('T')[0]
  const dateTo   = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  let totalUpserted = 0
  const errors: string[] = []

  for (const comp of COMPETITIONS) {
    try {
      const res = await fetch(
        `${FOOTBALL_API_BASE}/competitions/${comp.code}/matches?status=SCHEDULED&dateFrom=${dateFrom}&dateTo=${dateTo}`,
        { headers: { 'X-Auth-Token': FOOTBALL_API_KEY } },
      )

      if (!res.ok) {
        const text = await res.text()
        errors.push(`${comp.code}: HTTP ${res.status} — ${text.slice(0, 120)}`)
        continue
      }

      const data = await res.json()
      const apiMatches = (data.matches ?? []) as Array<{
        id: number
        utcDate: string
        homeTeam: { name: string; shortName: string }
        awayTeam: { name: string; shortName: string }
      }>

      if (apiMatches.length === 0) continue

      const rows = apiMatches.map(m => ({
        external_id:      `fd-${m.id}`,
        home_team:        normalizeTeamName(m.homeTeam.name, m.homeTeam.shortName),
        away_team:        normalizeTeamName(m.awayTeam.name, m.awayTeam.shortName),
        competition:      comp.name,
        match_date:       matchDateLabel(m.utcDate),
        match_time:       matchTimeLabel(m.utcDate),
        match_datetime:   m.utcDate,
        competition_logo: comp.emoji,
        home_team_logo:   '',
        away_team_logo:   '',
        venue_city:       '',
        is_featured:      false,
      }))

      const { error } = await supabase
        .from('matches')
        .upsert(rows, { onConflict: 'external_id', ignoreDuplicates: false })

      if (error) {
        errors.push(`${comp.code}: ${error.message}`)
      } else {
        totalUpserted += rows.length
      }
    } catch (err) {
      errors.push(`${comp.code}: ${String(err)}`)
    }
  }

  // Remove past synced matches (keep 3h buffer for late-running matches)
  const cutoff = new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString()
  const { error: cleanError } = await supabase
    .from('matches')
    .delete()
    .not('external_id', 'is', null)
    .lt('match_datetime', cutoff)

  if (cleanError) errors.push(`cleanup: ${cleanError.message}`)

  return new Response(
    JSON.stringify({ upserted: totalUpserted, errors }),
    { headers: { 'Content-Type': 'application/json' } },
  )
})
