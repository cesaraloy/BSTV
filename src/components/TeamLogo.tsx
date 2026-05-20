import { useState } from 'react'

// ─── Logo URL map ──────────────────────────────────────────────────────────
// Uses Wikipedia Special:Redirect/file – no hash needed, browser follows redirect.
// en.wikipedia.org for copyrighted fair-use badges; commons.wikimedia.org for free files.

const WP = (file: string) => `https://en.wikipedia.org/wiki/Special:Redirect/file/${encodeURIComponent(file)}`
const CM = (file: string) => `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(file)}`

export const teamLogos: Record<string, string> = {
  // ── LaLiga / Hypermotion ─────────────────────────────────────────────────
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
  'Málaga CF':            WP('Malaga_CF.svg'),
  'Deportivo Alavés':     WP('Deportivo_Alavés.svg'),
  'Alavés':               WP('Deportivo_Alavés.svg'),
  // ── Premier League ───────────────────────────────────────────────────────
  'Arsenal':              WP('Arsenal_FC.svg'),
  'Chelsea':              WP('Chelsea_FC.svg'),
  'Chelsea W':            WP('Chelsea_FC.svg'),
  'Liverpool':            WP('Liverpool_FC.svg'),
  'Manchester City':      WP('Manchester_City_FC_badge.svg'),
  'Manchester Utd W':     WP('Manchester_United_FC_crest.svg'),
  'Manchester United':    WP('Manchester_United_FC_crest.svg'),
  'Tottenham':            WP('Tottenham_Hotspur.svg'),
  'Newcastle United':     WP('Newcastle_United_logo.svg'),
  // ── Bundesliga ───────────────────────────────────────────────────────────
  'Bayern Múnich':        WP('FC_Bayern_München_logo_(2017).svg'),
  'Bayern Munich':        WP('FC_Bayern_München_logo_(2017).svg'),
  'Borussia Dortmund':    WP('Borussia_Dortmund_logo.svg'),
  'Bayer Leverkusen':     WP('Bayer_04_Leverkusen_logo.svg'),
  // ── Ligue 1 ──────────────────────────────────────────────────────────────
  'PSG':                  WP('Paris_Saint-Germain_F.C..svg'),
  'Paris Saint-Germain':  WP('Paris_Saint-Germain_F.C..svg'),
  'Lyon W':               WP('Olympique_Lyonnais_(logo).svg'),
  'Olympique Lyon':       WP('Olympique_Lyonnais_(logo).svg'),
  // ── Serie A ──────────────────────────────────────────────────────────────
  'Inter de Milán':       WP('FC_Internazionale_Milano_2021.svg'),
  'Inter Milan':          WP('FC_Internazionale_Milano_2021.svg'),
  'Lazio':                CM('S.S._Lazio_logo.svg'),
  'SS Lazio':             CM('S.S._Lazio_logo.svg'),
  'Juventus':             WP('Juventus_FC_2017_icon_(black).svg'),
  'AC Milan':             WP('AC_Milan_association_football_club_badge.svg'),
  'AS Roma':              WP('AS_Roma_logo_(2017).svg'),
  'Napoli':               WP('SSC_Napoli_badge.svg'),
  'Atalanta':             WP('Atalanta_BC_logo.svg'),
  // ── Champions / Europa / Women's CL ─────────────────────────────────────
  // (clubs already listed above by their proper names)
  // ── Motor sport manufacturers ────────────────────────────────────────────
  'Marc Márquez':         CM('Ducati_red_logo.svg'),
  'Francesco Bagnaia':    CM('Ducati_red_logo.svg'),
  'Max Verstappen':       WP('Red_Bull_Racing_logo.svg'),
  'Lewis Hamilton':       WP('Scuderia_Ferrari_logo.svg'),
  'Charles Leclerc':      WP('Scuderia_Ferrari_logo.svg'),
  'Fernando Alonso':      CM('Aston_Martin_Aramco_Formula_One_Team_logo.svg'),
  'Carlos Sainz':         CM('Scuderia_Ferrari_logo.svg'),
}

// ─── Brand colors (fallback badge) ────────────────────────────────────────
export const teamColors: Record<string, string> = {
  'Real Zaragoza':        '#003DA5',
  'SD Eibar':             '#003DA5',
  'Athletic Club':        '#EE2A24',
  'Espanyol':             '#003DA5',
  'RCD Espanyol':         '#003DA5',
  'Levante UD':           '#0033A0',
  'Deportivo Alavés':     '#2563EB',
  'Alavés':               '#2563EB',
  'Real Madrid':          '#00529F',
  'FC Barcelona':         '#A50044',
  'FC Barcelona W':       '#A50044',
  'Arsenal':              '#EF0107',
  'Bayern Múnich':        '#DC052D',
  'Bayern Munich':        '#DC052D',
  'PSG':                  '#003DA5',
  'Paris Saint-Germain':  '#003DA5',
  'Atlético de Madrid':   '#CB3524',
  'Lazio':                '#5B9BD5',
  'SS Lazio':             '#5B9BD5',
  'Chelsea':              '#034694',
  'Chelsea W':            '#034694',
  'Manchester Utd W':     '#DA291C',
  'Manchester United':    '#DA291C',
  'Lyon W':               '#0033A0',
  'Olympique Lyon':       '#0033A0',
  'Liverpool':            '#C8102E',
  'Manchester City':      '#6CABDD',
  'Tottenham':            '#132257',
  'Borussia Dortmund':    '#FDE100',
  'Bayer Leverkusen':     '#CC0000',
  'Inter de Milán':       '#003DA5',
  'Inter Milan':          '#003DA5',
  'Juventus':             '#000000',
  'AC Milan':             '#CC0000',
  'AS Roma':              '#8B0000',
  'Napoli':               '#00BFFF',
  'Atalanta':             '#1E3A8A',
  'Marc Márquez':         '#CC0000',
  'Francesco Bagnaia':    '#CC0000',
  'Max Verstappen':       '#1E3A8A',
  'Lewis Hamilton':       '#CC0000',
  'Charles Leclerc':      '#CC0000',
  'Fernando Alonso':      '#006F62',
  'Carlos Sainz':         '#CC0000',
}

// ─── Component ────────────────────────────────────────────────────────────
interface Props {
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

export default function TeamLogo({ name, logoUrl, size = 'sm', className = '' }: Props) {
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
