import { useState } from 'react'
import { competitionEmojis } from '../data/demo'

const WP = (f: string) => `https://en.wikipedia.org/wiki/Special:Redirect/file/${encodeURIComponent(f)}`
const CM = (f: string) => `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(f)}`

// ─── Competition logos ─────────────────────────────────────────────
export const competitionLogos: Record<string, string> = {
  'Champions League':           CM('UEFA_Champions_League_logo.svg'),
  'Europa League':              CM('UEFA_Europa_league_logo.svg'),
  "Women's Champions League":   WP("UEFA_Women's_Champions_League_logo.svg"),
  'LaLiga Hypermotion':         CM('LaLiga_Hypermotion.svg'),
  'LaLiga':                     CM('LaLiga_logo_(2023).svg'),
  'LaLiga EA Sports':           CM('LaLiga_logo_(2023).svg'),
  'La Liga':                    CM('LaLiga_logo_(2023).svg'),
  'Premier League':             CM('Premier_League_Logo.svg'),
  'Bundesliga':                 WP('Bundesliga_logo_(2017).svg'),
  'Serie A':                    CM('Serie_A_logo_(2019).svg'),
  'Ligue 1':                    CM('Ligue1.svg'),
  'MotoGP':                     WP('MotoGP_logo_(2024).svg'),
  'Formula 1':                  CM('Formula_1_logo.svg'),
  'F1':                         CM('Formula_1_logo.svg'),
}

// ─── Team logos ────────────────────────────────────────────────────
export const teamLogos: Record<string, string> = {
  // ── LaLiga / Hypermotion ─────────────────────────────────────────
  'Real Madrid':          WP('Real_Madrid_CF.svg'),
  'FC Barcelona':         WP('FC_Barcelona_(crest).svg'),
  'FC Barcelona W':       WP('FC_Barcelona_(crest).svg'),
  'Atlético de Madrid':   WP('Atletico_Madrid_logo.svg'),
  'Athletic Club':        WP('Athletic_Club_crest.svg'),
  'Real Zaragoza':        WP('Real_Zaragoza.svg'),
  'SD Eibar':             WP('SD_Eibar_logo_2016.svg'),
  'Espanyol':             WP('RCD_Espanyol_badge.svg'),
  'RCD Espanyol':         WP('RCD_Espanyol_badge.svg'),
  'Levante UD':           WP('Levante_UD.svg'),
  'Villarreal CF':        WP('Villarreal_CF_logo-en.svg'),
  'Villarreal':           WP('Villarreal_CF_logo-en.svg'),
  'Sevilla FC':           WP('Sevilla_FC_logo.svg'),
  'Sevilla':              WP('Sevilla_FC_logo.svg'),
  'Valencia CF':          WP('Valenciacf.svg'),
  'Valencia':             WP('Valenciacf.svg'),
  'Real Betis':           WP('Real_betis_logo.svg'),
  'Real Sociedad':        WP('Real_Sociedad_logo.svg'),
  'Girona FC':            WP('Girona_FC_Logo.svg'),
  'Girona':               WP('Girona_FC_Logo.svg'),
  'Celta Vigo':           WP('RC_Celta_de_Vigo_logo.svg'),
  'RC Celta':             WP('RC_Celta_de_Vigo_logo.svg'),
  'Osasuna':              WP('Osasuna_logo.svg'),
  'CA Osasuna':           WP('Osasuna_logo.svg'),
  'Rayo Vallecano':       CM('Rayo_Vallecano_logo.svg'),
  'Getafe CF':            WP('Getafe_CF.svg'),
  'Getafe':               WP('Getafe_CF.svg'),
  'Deportivo Alavés':     WP('Deportivo_Alavés.svg'),
  'Alavés':               WP('Deportivo_Alavés.svg'),
  'Málaga CF':            WP('Malaga_CF.svg'),
  // ── Premier League ───────────────────────────────────────────────
  'Arsenal':              WP('Arsenal_FC.svg'),
  'Chelsea':              WP('Chelsea_FC.svg'),
  'Chelsea W':            WP('Chelsea_FC.svg'),
  'Liverpool':            WP('Liverpool_FC.svg'),
  'Manchester City':      WP('Manchester_City_FC_badge.svg'),
  'Manchester Utd W':     WP('Manchester_United_FC_crest.svg'),
  'Manchester United':    WP('Manchester_United_FC_crest.svg'),
  'Tottenham':            WP('Tottenham_Hotspur.svg'),
  'Newcastle United':     WP('Newcastle_United_logo.svg'),
  'Aston Villa':          WP('Aston_Villa_crest_(2016).svg'),
  'West Ham':             WP('West_Ham_United_FC_logo.svg'),
  'Brighton':             WP('Brighton_&_Hove_Albion_logo.svg'),
  // ── Bundesliga ───────────────────────────────────────────────────
  'Bayern Múnich':        WP('FC_Bayern_München_logo_(2017).svg'),
  'Bayern Munich':        WP('FC_Bayern_München_logo_(2017).svg'),
  'Borussia Dortmund':    WP('Borussia_Dortmund_logo.svg'),
  'Bayer Leverkusen':     WP('Bayer_04_Leverkusen_logo.svg'),
  'RB Leipzig':           WP('RB_Leipzig_2014_logo.svg'),
  'Eintracht Frankfurt':  CM('Eintracht_Frankfurt_Logo.svg'),
  // ── Ligue 1 ──────────────────────────────────────────────────────
  'PSG':                  WP('Paris_Saint-Germain_F.C..svg'),
  'Paris Saint-Germain':  WP('Paris_Saint-Germain_F.C..svg'),
  'Lyon W':               WP('Olympique_Lyonnais_(logo).svg'),
  'Olympique Lyon':       WP('Olympique_Lyonnais_(logo).svg'),
  'Olympique de Marseille': CM('Olympique_de_Marseille_logo.svg'),
  'Marseille':            CM('Olympique_de_Marseille_logo.svg'),
  // ── Serie A ──────────────────────────────────────────────────────
  'Inter de Milán':       WP('FC_Internazionale_Milano_2021.svg'),
  'Inter Milan':          WP('FC_Internazionale_Milano_2021.svg'),
  'Lazio':                CM('S.S._Lazio_logo.svg'),
  'SS Lazio':             CM('S.S._Lazio_logo.svg'),
  'Juventus':             WP('Juventus_FC_2017_icon_(black).svg'),
  'AC Milan':             WP('Logo_of_AC_Milan.svg'),
  'AS Roma':              WP('AS_Roma_logo_(2017).svg'),
  'Napoli':               WP('SSC_Napoli_badge.svg'),
  'Atalanta':             WP('Atalanta_BC_logo.svg'),
  'Fiorentina':           CM('ACF_Fiorentina.svg'),
  // ── Portuguesa ───────────────────────────────────────────────────
  'Benfica':              WP('SL_Benfica_logo.svg'),
  'SL Benfica':           WP('SL_Benfica_logo.svg'),
  'Porto':                CM('FC_Porto.svg'),
  'FC Porto':             CM('FC_Porto.svg'),
  'Sporting CP':          CM('Sporting_Clube_de_Portugal.svg'),
  // ── Eredivisie ───────────────────────────────────────────────────
  'Ajax':                 CM('Ajax_logo.svg'),
  // ── Motor sport manufacturers ────────────────────────────────────
  'Marc Márquez':         CM('Ducati_red_logo.svg'),
  'Francesco Bagnaia':    CM('Ducati_red_logo.svg'),
  'Max Verstappen':       WP('Red_Bull_Racing_logo.svg'),
  'Lewis Hamilton':       WP('Scuderia_Ferrari_logo.svg'),
  'Charles Leclerc':      WP('Scuderia_Ferrari_logo.svg'),
  'Fernando Alonso':      CM('Aston_Martin_Aramco_Formula_One_Team_logo.svg'),
  'Carlos Sainz':         CM('Scuderia_Ferrari_logo.svg'),
}

// ─── Brand colors (fallback badge) ────────────────────────────────
export const teamColors: Record<string, string> = {
  'Real Zaragoza': '#003DA5', 'SD Eibar': '#003DA5',
  'Athletic Club': '#EE2A24', 'Espanyol': '#003DA5', 'RCD Espanyol': '#003DA5',
  'Levante UD': '#0033A0', 'Deportivo Alavés': '#2563EB', 'Alavés': '#2563EB',
  'Villarreal CF': '#FFD700', 'Villarreal': '#FFD700',
  'Sevilla FC': '#CC0000', 'Sevilla': '#CC0000',
  'Valencia CF': '#FF7F00', 'Valencia': '#FF7F00',
  'Real Betis': '#00A550', 'Real Sociedad': '#003DA5',
  'Girona FC': '#CC0000', 'Girona': '#CC0000',
  'Celta Vigo': '#6CABDD', 'RC Celta': '#6CABDD',
  'Osasuna': '#CC0000', 'CA Osasuna': '#CC0000',
  'Rayo Vallecano': '#CC0000', 'Getafe CF': '#003DA5', 'Getafe': '#003DA5',
  'Real Madrid': '#00529F', 'FC Barcelona': '#A50044', 'FC Barcelona W': '#A50044',
  'Arsenal': '#EF0107', 'Bayern Múnich': '#DC052D', 'Bayern Munich': '#DC052D',
  'PSG': '#003DA5', 'Paris Saint-Germain': '#003DA5',
  'Atlético de Madrid': '#CB3524',
  'Lazio': '#5B9BD5', 'SS Lazio': '#5B9BD5',
  'Chelsea': '#034694', 'Chelsea W': '#034694',
  'Manchester Utd W': '#DA291C', 'Manchester United': '#DA291C',
  'Lyon W': '#0033A0', 'Olympique Lyon': '#0033A0',
  'Liverpool': '#C8102E', 'Manchester City': '#6CABDD',
  'Tottenham': '#132257', 'Aston Villa': '#95BFE5',
  'West Ham': '#7A263A', 'Brighton': '#0057B8',
  'Newcastle United': '#241F20',
  'Borussia Dortmund': '#FDE100', 'Bayer Leverkusen': '#CC0000',
  'RB Leipzig': '#CC0000', 'Eintracht Frankfurt': '#CC0000',
  'Inter de Milán': '#003DA5', 'Inter Milan': '#003DA5',
  'Juventus': '#000000', 'AC Milan': '#CC0000',
  'AS Roma': '#8B0000', 'Napoli': '#00BFFF', 'Atalanta': '#1E3A8A',
  'Fiorentina': '#6B21A8',
  'Benfica': '#CC0000', 'SL Benfica': '#CC0000',
  'Porto': '#003DA5', 'FC Porto': '#003DA5',
  'Sporting CP': '#006400', 'Ajax': '#CC0000',
  'Marseille': '#009FC8', 'Olympique de Marseille': '#009FC8',
  'Marc Márquez': '#CC0000', 'Francesco Bagnaia': '#CC0000',
  'Max Verstappen': '#1E3A8A', 'Lewis Hamilton': '#CC0000',
  'Charles Leclerc': '#CC0000', 'Fernando Alonso': '#006F62', 'Carlos Sainz': '#CC0000',
}

// ─── CompetitionLogo component ─────────────────────────────────────
interface CompProps {
  name: string
  size?: number
  className?: string
}

export function CompetitionLogo({ name, size = 20, className = '' }: CompProps) {
  const [failed, setFailed] = useState(false)
  const url = competitionLogos[name]
  const emoji = competitionEmojis[name] ?? '🏆'

  if (url && !failed) {
    return (
      <img
        src={url}
        alt={name}
        style={{ width: size, height: size }}
        className={`object-contain ${className}`}
        onError={() => setFailed(true)}
      />
    )
  }
  return <span style={{ fontSize: size * 0.8 }}>{emoji}</span>
}

// ─── TeamLogo component ────────────────────────────────────────────
interface TeamProps {
  name: string
  logoUrl?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  xs:  { container: 'w-6 h-6',   text: 'text-[7px]' },
  sm:  { container: 'w-8 h-8',   text: 'text-[9px]' },
  md:  { container: 'w-10 h-10', text: 'text-[11px]' },
  lg:  { container: 'w-16 h-16', text: 'text-lg' },
}

export default function TeamLogo({ name, logoUrl, size = 'sm', className = '' }: TeamProps) {
  const [failed, setFailed] = useState(false)
  const url = logoUrl || teamLogos[name]
  const color = teamColors[name] ?? '#334155'
  const initials = name
    .split(' ')
    .filter(w => /^[A-ZÁÉÍÓÚÑ]/i.test(w))
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const { container, text } = sizeMap[size]

  if (url && !failed) {
    return (
      <img
        src={url}
        alt={name}
        className={`${container} object-contain rounded-sm ${className}`}
        onError={() => setFailed(true)}
      />
    )
  }

  return (
    <div
      className={`${container} rounded-full flex items-center justify-center font-bold text-white shrink-0 ${className}`}
      style={{ background: color }}
    >
      <span className={text}>{initials}</span>
    </div>
  )
}
