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
  // ── España ────────────────────────────────────────────────────────
  { code: 'PD',  name: 'LaLiga',             emoji: '🇪🇸' },
  // ── Inglaterra ────────────────────────────────────────────────────
  { code: 'PL',  name: 'Premier League',     emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  // ── Europa ────────────────────────────────────────────────────────
  { code: 'CL',  name: 'Champions League',   emoji: '⭐' },
  { code: 'EL',  name: 'Europa League',      emoji: '🏆' },
  { code: 'EC',  name: 'Eurocopa',           emoji: '🇪🇺' },
  // ── Alemania ──────────────────────────────────────────────────────
  { code: 'BL1', name: 'Bundesliga',         emoji: '🇩🇪' },
  // ── Italia ────────────────────────────────────────────────────────
  { code: 'SA',  name: 'Serie A',            emoji: '🇮🇹' },
  // ── Francia ───────────────────────────────────────────────────────
  { code: 'FL1', name: 'Ligue 1',            emoji: '🇫🇷' },
  // ── Portugal ──────────────────────────────────────────────────────
  { code: 'PPL', name: 'Primeira Liga',      emoji: '🇵🇹' },
  // ── Países Bajos ──────────────────────────────────────────────────
  { code: 'DED', name: 'Eredivisie',         emoji: '🇳🇱' },
  // ── Sudamérica ────────────────────────────────────────────────────
  { code: 'CLI', name: 'Copa Libertadores',  emoji: '🌎' },
  { code: 'BSA', name: 'Brasileirão',        emoji: '🇧🇷' },
  // ── Internacional ─────────────────────────────────────────────────
  { code: 'WC',  name: 'Mundial',            emoji: '🌍' },
]

// Clubs whose matches are always featured
const FEATURED_CLUBS = new Set([
  // España
  'Real Madrid', 'FC Barcelona', 'Atlético de Madrid',
  // Inglaterra
  'Manchester City', 'Liverpool', 'Arsenal', 'Chelsea', 'Manchester United',
  // Alemania
  'Bayern Múnich', 'Borussia Dortmund', 'Bayer Leverkusen',
  // Italia
  'Inter de Milán', 'AC Milan', 'Juventus', 'Napoli',
  // Francia
  'PSG',
  // Portugal
  'Benfica', 'Porto', 'Sporting CP',
  // Países Bajos
  'Ajax', 'PSV', 'Feyenoord',
])

// Maps football-data.org team names → BSTV Spanish-style names
const TEAM_NAME_MAP: Record<string, string> = {
  // ── LaLiga ────────────────────────────────────────────────────────
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
  // ── Premier League ────────────────────────────────────────────────
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
  // ── Bundesliga ────────────────────────────────────────────────────
  'FC Bayern München':            'Bayern Múnich',
  'Borussia Dortmund':            'Borussia Dortmund',
  'Bayer 04 Leverkusen':          'Bayer Leverkusen',
  'RB Leipzig':                   'RB Leipzig',
  'VfB Stuttgart':                'VfB Stuttgart',
  'Eintracht Frankfurt':          'Eintracht Frankfurt',
  'SC Freiburg':                  'SC Freiburg',
  '1. FC Union Berlin':           'Union Berlin',
  'Borussia Mönchengladbach':     "Borussia M'gladbach",
  'TSG 1899 Hoffenheim':          'Hoffenheim',
  'SV Werder Bremen':             'Werder Bremen',
  'VfL Wolfsburg':                'Wolfsburg',
  'VfL Bochum 1848':              'VfL Bochum',
  'FC Augsburg':                  'FC Augsburg',
  '1. FSV Mainz 05':              'Mainz 05',
  'FC St. Pauli 1910':            'FC St. Pauli',
  'Holstein Kiel':                'Holstein Kiel',
  '1. FC Heidenheim 1846':        'Heidenheim',
  // ── Serie A ───────────────────────────────────────────────────────
  'FC Internazionale Milano':     'Inter de Milán',
  'Inter Milan':                  'Inter de Milán',
  'AC Milan':                     'AC Milan',
  'Juventus FC':                  'Juventus',
  'SSC Napoli':                   'Napoli',
  'AS Roma':                      'AS Roma',
  'ACF Fiorentina':               'Fiorentina',
  'SS Lazio':                     'Lazio',
  'Atalanta BC':                  'Atalanta',
  'Torino FC':                    'Torino',
  'Bologna FC 1909':              'Bologna',
  'Udinese Calcio':               'Udinese',
  'Cagliari Calcio':              'Cagliari',
  'Empoli FC':                    'Empoli',
  'Hellas Verona FC':             'Hellas Verona',
  'Genoa CFC':                    'Genoa',
  'AC Monza':                     'Monza',
  'Venezia FC':                   'Venezia',
  'Como 1907':                    'Como',
  'Parma Calcio 1913':            'Parma',
  // ── Ligue 1 ───────────────────────────────────────────────────────
  'Paris Saint-Germain FC':       'PSG',
  'AS Monaco FC':                 'Monaco',
  'LOSC Lille':                   'Lille',
  'Olympique Lyonnais':           'Olympique Lyon',
  'Olympique de Marseille':       'Olympique de Marseille',
  'Stade Rennais FC 1901':        'Stade Rennais',
  'RC Lens':                      'RC Lens',
  'OGC Nice':                     'OGC Nice',
  'Stade de Reims':               'Stade de Reims',
  'Montpellier HSC':              'Montpellier',
  'FC Nantes':                    'FC Nantes',
  'Toulouse FC':                  'Toulouse FC',
  'RC Strasbourg Alsace':         'Strasbourg',
  'Le Havre AC':                  'Le Havre',
  'Stade Brestois 29':            'Brest',
  'AJ Auxerre':                   'Auxerre',
  'Angers SCO':                   'Angers',
  'Saint-Étienne':                'Saint-Étienne',
  // ── Primeira Liga ─────────────────────────────────────────────────
  'SL Benfica':                   'Benfica',
  'FC Porto':                     'Porto',
  'Sporting CP':                  'Sporting CP',
  'SC Braga':                     'SC Braga',
  'Vitória SC':                   'Vitória SC',
  'Casa Pia AC':                  'Casa Pia',
  'GD Estoril Praia':             'Estoril',
  'Rio Ave FC':                   'Rio Ave',
  'FC Famalicão':                 'Famalicão',
  'CF Os Belenenses':             'Belenenses',
  // ── Eredivisie ────────────────────────────────────────────────────
  'AFC Ajax':                     'Ajax',
  'PSV Eindhoven':                'PSV',
  'Feyenoord Rotterdam':          'Feyenoord',
  'AZ Alkmaar':                   'AZ Alkmaar',
  'FC Utrecht':                   'FC Utrecht',
  'SC Heerenveen':                'SC Heerenveen',
  'NEC Nijmegen':                 'NEC Nijmegen',
  'FC Groningen':                 'FC Groningen',
  'Sparta Rotterdam':             'Sparta Rotterdam',
  'FC Twente':                    'FC Twente',
  'Go Ahead Eagles':              'Go Ahead Eagles',
  'Almere City FC':               'Almere City',
  'PEC Zwolle':                   'PEC Zwolle',
  'RKC Waalwijk':                 'RKC Waalwijk',
  'Heracles Almelo':              'Heracles',
  'NAC Breda':                    'NAC Breda',
  'Willem II':                    'Willem II',
  // ── Champions / Europa League extras ──────────────────────────────
  'Borussia Mönchengladbach':     "Borussia M'gladbach",
  'Fenerbahçe SK':                'Fenerbahçe',
  'Galatasaray A.Ş.':             'Galatasaray',
  'Beşiktaş JK':                  'Beşiktaş',
  'Celtic FC':                    'Celtic',
  'Rangers FC':                   'Rangers',
  'GNK Dinamo Zagreb':            'Dinamo Zagreb',
  'FK Shakhtar Donetsk':          'Shakhtar Donetsk',
  'Club Brugge KV':               'Club Brugge',
  'RSC Anderlecht':               'Anderlecht',
  'Red Bull Salzburg':            'RB Salzburg',
  'SK Slavia Prague':             'Slavia Praga',
  // ── Selecciones nacionales (Mundial / Eurocopa) ───────────────────
  'Spain':                        'España',
  'Germany':                      'Alemania',
  'France':                       'Francia',
  'Brazil':                       'Brasil',
  'Argentina':                    'Argentina',
  'England':                      'Inglaterra',
  'Portugal':                     'Portugal',
  'Netherlands':                  'Países Bajos',
  'Italy':                        'Italia',
  'Belgium':                      'Bélgica',
  'Croatia':                      'Croacia',
  'Uruguay':                      'Uruguay',
  'Colombia':                     'Colombia',
  'Mexico':                       'México',
  'United States':                'Estados Unidos',
  'Morocco':                      'Marruecos',
  'Senegal':                      'Senegal',
  'Japan':                        'Japón',
  'South Korea':                  'Corea del Sur',
  'Australia':                    'Australia',
  'Denmark':                      'Dinamarca',
  'Switzerland':                  'Suiza',
  'Poland':                       'Polonia',
  'Serbia':                       'Serbia',
  'Ukraine':                      'Ucrania',
  'Austria':                      'Austria',
  'Turkey':                       'Turquía',
  'Ecuador':                      'Ecuador',
  'Chile':                        'Chile',
  'Peru':                         'Perú',
  'Venezuela':                    'Venezuela',
  'Paraguay':                     'Paraguay',
  'Bolivia':                      'Bolivia',
  'Canada':                       'Canadá',
}

function normalizeTeamName(apiName: string, shortName: string): string {
  return TEAM_NAME_MAP[apiName] ?? TEAM_NAME_MAP[shortName] ?? shortName ?? apiName
}

function isFeatured(homeTeam: string, awayTeam: string, competition: string): boolean {
  // All World Cup and Eurocopa matches are featured
  if (competition === 'Mundial' || competition === 'Eurocopa') return true
  // Champions League matches involving top clubs
  return FEATURED_CLUBS.has(homeTeam) || FEATURED_CLUBS.has(awayTeam)
}

function matchDateLabel(utcDate: string): string {
  const fmt = (d: Date) =>
    new Intl.DateTimeFormat('es-ES', {
      timeZone: 'Europe/Madrid',
      year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(d)

  const now      = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const matchStr = fmt(new Date(utcDate))
  if (matchStr === fmt(now))      return 'HOY'
  if (matchStr === fmt(tomorrow)) return 'MAÑANA'

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
  const dateTo   = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  let totalUpserted = 0
  const skipped: string[] = []
  const errors: string[] = []

  for (const comp of COMPETITIONS) {
    try {
      const res = await fetch(
        `${FOOTBALL_API_BASE}/competitions/${comp.code}/matches?status=SCHEDULED&dateFrom=${dateFrom}&dateTo=${dateTo}`,
        { headers: { 'X-Auth-Token': FOOTBALL_API_KEY } },
      )

      if (res.status === 404 || res.status === 403) {
        // Competition not active this season or not in plan — skip silently
        skipped.push(comp.code)
        continue
      }

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

      if (apiMatches.length === 0) {
        skipped.push(comp.code)
        continue
      }

      const rows = apiMatches.map(m => {
        const homeTeam = normalizeTeamName(m.homeTeam.name, m.homeTeam.shortName)
        const awayTeam = normalizeTeamName(m.awayTeam.name, m.awayTeam.shortName)
        return {
          external_id:      `fd-${m.id}`,
          home_team:        homeTeam,
          away_team:        awayTeam,
          competition:      comp.name,
          match_date:       matchDateLabel(m.utcDate),
          match_time:       matchTimeLabel(m.utcDate),
          match_datetime:   m.utcDate,
          competition_logo: comp.emoji,
          home_team_logo:   '',
          away_team_logo:   '',
          venue_city:       '',
          is_featured:      isFeatured(homeTeam, awayTeam, comp.name),
        }
      })

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

  // Remove past synced matches (3h buffer for late-running matches)
  const cutoff = new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString()
  const { error: cleanError } = await supabase
    .from('matches')
    .delete()
    .not('external_id', 'is', null)
    .lt('match_datetime', cutoff)

  if (cleanError) errors.push(`cleanup: ${cleanError.message}`)

  return new Response(
    JSON.stringify({ upserted: totalUpserted, skipped, errors }),
    { headers: { 'Content-Type': 'application/json' } },
  )
})
