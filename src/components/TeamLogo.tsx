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
  // ── LaLiga ───────────────────────────────────────────────────────
  'Real Madrid':            WP('Real_Madrid_CF.svg'),
  'FC Barcelona':           WP('FC_Barcelona_(crest).svg'),
  'FC Barcelona W':         WP('FC_Barcelona_(crest).svg'),
  'Atlético de Madrid':     WP('Atletico_Madrid_logo.svg'),
  'Athletic Club':          WP('Club_Athletic_Bilbao_logo.svg'),
  'Villarreal CF':          WP('Villarreal_CF_logo-en.svg'),
  'Villarreal':             WP('Villarreal_CF_logo-en.svg'),
  'Real Sociedad':          WP('Real_Sociedad_logo.svg'),
  'Real Betis':             WP('Real_betis_logo.svg'),
  'Sevilla FC':             WP('Sevilla_FC_logo.svg'),
  'Sevilla':                WP('Sevilla_FC_logo.svg'),
  'Girona FC':              WP('Girona_FC_Logo.svg'),
  'Girona':                 WP('Girona_FC_Logo.svg'),
  'RC Celta':               WP('RC_Celta_de_Vigo_logo.svg'),
  'Celta Vigo':             WP('RC_Celta_de_Vigo_logo.svg'),
  'CA Osasuna':             WP('Osasuna_logo.svg'),
  'Osasuna':                WP('Osasuna_logo.svg'),
  'Rayo Vallecano':         WP('Rayo_Vallecano_logo.svg'),
  'Getafe CF':              WP('Getafe_CF_logo.svg'),
  'Getafe':                 WP('Getafe_CF_logo.svg'),
  'Valencia CF':            WP('Valenciacf.svg'),
  'Valencia':               WP('Valenciacf.svg'),
  'RCD Espanyol':           WP('RCD_Espanyol_logo.svg'),
  'Espanyol':               WP('RCD_Espanyol_logo.svg'),
  'RCD Mallorca':           WP('Rcd_mallorca.svg'),
  'Mallorca':               WP('Rcd_mallorca.svg'),
  'Deportivo Alavés':       WP('Deportivo_Alavés_2020.svg'),
  'Alavés':                 WP('Deportivo_Alavés_2020.svg'),
  'Real Valladolid':        WP('Real_Valladolid_Logo.svg'),
  'UD Las Palmas':          WP('UD_Las_Palmas_logo.svg'),
  'CD Leganés':             WP('CD_Leganes_logo.svg'),
  'Leganés':                WP('CD_Leganes_logo.svg'),
  // ── LaLiga Hypermotion ───────────────────────────────────────────
  'Real Zaragoza':          WP('Real_Zaragoza_logo.svg'),
  'SD Eibar':               WP('SD_Eibar_logo_2016.svg'),
  'Levante UD':             WP('Levante_UD_logo.svg'),
  'Sporting de Gijón':      WP('Real_Sporting_de_Gijon.svg'),
  'Real Oviedo':            WP('Real_Oviedo_logo.svg'),
  'UD Almería':             WP('UD_Almeria_logo.svg'),
  'Almería':                WP('UD_Almeria_logo.svg'),
  'SD Huesca':              WP('SD_Huesca_logo.svg'),
  'CD Tenerife':            WP('CD_Tenerife_logo.svg'),
  'Málaga CF':              WP('Malaga_CF_logo.svg'),
  'Burgos CF':              WP('Burgos_CF_logo.svg'),
  'CD Castellón':           WP('CD_Castellon_logo.svg'),
  'CD Eldense':             WP('CD_Eldense_logo.svg'),
  'Deportivo de La Coruña': WP('RC_Deportivo_de_La_Coruna_logo.svg'),
  'FC Andorra':             CM('FCAndorra.svg'),
  'Mirandés':               WP('CD_Mirandes_logo.svg'),
  'Racing de Santander':    WP('Racing_de_Santander_logo.svg'),
  // ── Premier League ───────────────────────────────────────────────
  'Arsenal':                WP('Arsenal_FC.svg'),
  'Arsenal W':              WP('Arsenal_FC.svg'),
  'Chelsea':                WP('Chelsea_FC.svg'),
  'Chelsea W':              WP('Chelsea_FC.svg'),
  'Liverpool':              WP('Liverpool_FC.svg'),
  'Manchester City':        WP('Manchester_City_FC_badge.svg'),
  'Manchester City W':      WP('Manchester_City_FC_badge.svg'),
  'Manchester United':      WP('Manchester_United_FC_crest.svg'),
  'Manchester Utd W':       WP('Manchester_United_FC_crest.svg'),
  'Tottenham':              WP('Tottenham_Hotspur.svg'),
  'Tottenham Hotspur':      WP('Tottenham_Hotspur.svg'),
  'Newcastle United':       WP('Newcastle_United_Logo.svg'),
  'Aston Villa':            WP('Aston_Villa_crest_(2016).svg'),
  'West Ham':               WP('West_Ham_United_FC_logo.svg'),
  'West Ham United':        WP('West_Ham_United_FC_logo.svg'),
  'Brighton':               WP('Brighton_&_Hove_Albion_logo.svg'),
  'Brentford':              CM('Logo_Brentford_FC_2016.svg'),
  'Wolverhampton':          WP('Wolverhampton_Wanderers.svg'),
  'Wolves':                 WP('Wolverhampton_Wanderers.svg'),
  'Crystal Palace':         WP('Crystal_Palace_FC_logo.svg'),
  'Fulham':                 WP('Fulham_FC_(shield).svg'),
  'Everton':                WP('Everton_FC_logo.svg'),
  'Nottingham Forest':      WP('Nottingham_Forest_logo.svg'),
  'Bournemouth':            WP('AFC_Bournemouth_(2013).svg'),
  'Leicester City':         WP('Leicester_City_crest.svg'),
  'Ipswich Town':           WP('Ipswich_Town.svg'),
  'Southampton':            WP('FC_Southampton.svg'),
  // ── Bundesliga ───────────────────────────────────────────────────
  'Bayern Múnich':          WP('FC_Bayern_München_logo_(2017).svg'),
  'Bayern Munich':          WP('FC_Bayern_München_logo_(2017).svg'),
  'Borussia Dortmund':      WP('Borussia_Dortmund_logo.svg'),
  'Bayer Leverkusen':       WP('Bayer_04_Leverkusen_logo.svg'),
  'RB Leipzig':             WP('RB_Leipzig_2014_logo.svg'),
  'Eintracht Frankfurt':    CM('Eintracht_Frankfurt_Logo.svg'),
  'Fenerbahçe':             WP('Fenerbahce_SK.svg'),
  'Galatasaray':            CM('Galatasaray_Sports_Club_Logo.svg'),
  'VfL Wolfsburg':          WP('VfL_Wolfsburg_Logo.svg'),
  'VfB Stuttgart':          WP('VfB_Stuttgart_1893_logo.svg'),
  'Werder Bremen':          WP('SV_Werder_Bremen_logo.svg'),
  'Borussia Mönchengladbach': WP('Borussia_Mönchengladbach_logo.svg'),
  // ── Ligue 1 ──────────────────────────────────────────────────────
  'PSG':                    WP('Paris_Saint-Germain_F.C..svg'),
  'Paris Saint-Germain':    WP('Paris_Saint-Germain_F.C..svg'),
  'PSG W':                  WP('Paris_Saint-Germain_F.C..svg'),
  'Olympique Lyon':         WP('Olympique_Lyonnais_logo.svg'),
  'Lyon W':                 WP('Olympique_Lyonnais_logo.svg'),
  'Olympique de Marseille': CM('Olympique_Marseille_logo.svg'),
  'Marseille':              CM('Olympique_Marseille_logo.svg'),
  'Monaco':                 WP('AS_Monaco_FC_Logo.svg'),
  'AS Monaco':              WP('AS_Monaco_FC_Logo.svg'),
  'Lille':                  WP('Losc_Lille_logo.svg'),
  // ── Serie A ──────────────────────────────────────────────────────
  'Inter de Milán':         WP('FC_Internazionale_Milano_2021.svg'),
  'Inter Milan':            WP('FC_Internazionale_Milano_2021.svg'),
  'AC Milan':               WP('Logo_of_AC_Milan.svg'),
  'Juventus':               WP('Juventus_FC_2017_icon_(black).svg'),
  'AS Roma':                WP('AS_Roma_logo_(2017).svg'),
  'Napoli':                 CM('SSC_Napoli.svg'),
  'Atalanta':               CM('Logo_Atalanta_Bergamo.svg'),
  'Fiorentina':             CM('ACF_Fiorentina.svg'),
  'Lazio':                  CM('S.S._Lazio_logo.svg'),
  'SS Lazio':               CM('S.S._Lazio_logo.svg'),
  'Bologna':                WP('Bologna_F.C._1909_logo.svg'),
  // ── Portuguesa ───────────────────────────────────────────────────
  'SL Benfica':             WP('SL_Benfica_logo.svg'),
  'Benfica':                WP('SL_Benfica_logo.svg'),
  'FC Porto':               WP('FC_Porto.svg'),
  'Porto':                  WP('FC_Porto.svg'),
  'Sporting CP':            CM('Sporting_Clube_de_Portugal.svg'),
  // ── Eredivisie ───────────────────────────────────────────────────
  'Ajax':                   CM('Ajax_logo.svg'),
  'PSV':                    WP('PSV_Eindhoven.svg'),
  'Feyenoord':              CM('Feyenoord_logo_since_2024.svg'),
  // ── Women's CL extra ─────────────────────────────────────────────
  'VfL Wolfsburg W':        WP('VfL_Wolfsburg_Logo.svg'),
  'Bayern W':               WP('FC_Bayern_München_logo_(2017).svg'),
  // ── MotoGP ───────────────────────────────────────────────────────
  'Marc Márquez':           CM('Ducati_red_logo.svg'),
  'Francesco Bagnaia':      CM('Ducati_red_logo.svg'),
  'Jorge Martín':           CM('Aprilia_Racing.svg'),
  'Maverick Viñales':       CM('Aprilia_Racing.svg'),
  'Pedro Acosta':           WP('Red_Bull_KTM_Factory_Racing_logo.svg'),
  'Fabio Quartararo':       CM('Yamaha_Logo.svg'),
  'Enea Bastianini':        CM('Ducati_red_logo.svg'),
  // ── Formula 1 ────────────────────────────────────────────────────
  'Max Verstappen':         WP('Red_Bull_Racing_logo.svg'),
  'Lewis Hamilton':         WP('Scuderia_Ferrari_logo.svg'),
  'Charles Leclerc':        WP('Scuderia_Ferrari_logo.svg'),
  'Fernando Alonso':        CM('Aston_Martin_Aramco_Formula_One_Team_logo.svg'),
  'Carlos Sainz':           CM('Scuderia_Ferrari_logo.svg'),
  'Lando Norris':           WP('McLaren_Racing_logo.svg'),
  'George Russell':         WP('Mercedes-Benz_in_Formula_One_logo.svg'),
  'Oscar Piastri':          WP('McLaren_Racing_logo.svg'),
  'Sergio Pérez':           WP('Red_Bull_Racing_logo.svg'),
}

// ─── Brand colors (fallback badge) ────────────────────────────────
export const teamColors: Record<string, string> = {
  // LaLiga
  'Real Madrid': '#00529F', 'FC Barcelona': '#A50044', 'FC Barcelona W': '#A50044',
  'Atlético de Madrid': '#CB3524', 'Athletic Club': '#EE2A24',
  'Villarreal CF': '#FFD700', 'Villarreal': '#FFD700',
  'Real Sociedad': '#003DA5', 'Real Betis': '#00A550',
  'Sevilla FC': '#CC0000', 'Sevilla': '#CC0000',
  'Girona FC': '#CC0000', 'Girona': '#CC0000',
  'RC Celta': '#6CABDD', 'Celta Vigo': '#6CABDD',
  'CA Osasuna': '#CC0000', 'Osasuna': '#CC0000',
  'Rayo Vallecano': '#CC0000',
  'Getafe CF': '#003DA5', 'Getafe': '#003DA5',
  'Valencia CF': '#FF7F00', 'Valencia': '#FF7F00',
  'RCD Espanyol': '#003DA5', 'Espanyol': '#003DA5',
  'RCD Mallorca': '#CC0000', 'Mallorca': '#CC0000',
  'Deportivo Alavés': '#2563EB', 'Alavés': '#2563EB',
  'Real Valladolid': '#6B21A8', 'UD Las Palmas': '#FFD700',
  'CD Leganés': '#003DA5', 'Leganés': '#003DA5',
  // Hypermotion
  'Real Zaragoza': '#003DA5', 'SD Eibar': '#003DA5',
  'Levante UD': '#0033A0', 'Sporting de Gijón': '#CC0000',
  'Real Oviedo': '#003DA5', 'UD Almería': '#CC0000', 'Almería': '#CC0000',
  'SD Huesca': '#003DA5', 'CD Tenerife': '#003DA5', 'Málaga CF': '#003DA5',
  // Premier League
  'Arsenal': '#EF0107', 'Arsenal W': '#EF0107',
  'Chelsea': '#034694', 'Chelsea W': '#034694',
  'Liverpool': '#C8102E',
  'Manchester City': '#6CABDD', 'Manchester City W': '#6CABDD',
  'Manchester United': '#DA291C', 'Manchester Utd W': '#DA291C',
  'Tottenham': '#132257', 'Tottenham Hotspur': '#132257',
  'Newcastle United': '#241F20', 'Aston Villa': '#95BFE5',
  'West Ham': '#7A263A', 'West Ham United': '#7A263A',
  'Brighton': '#0057B8', 'Brentford': '#CC0000',
  'Wolverhampton': '#FDB913', 'Wolves': '#FDB913',
  'Crystal Palace': '#1B458F', 'Fulham': '#CC0000',
  'Everton': '#003399', 'Nottingham Forest': '#CC0000',
  'Bournemouth': '#CC0000', 'Leicester City': '#003090',
  'Ipswich Town': '#003DA5', 'Southampton': '#CC0000',
  // Bundesliga
  'Bayern Múnich': '#DC052D', 'Bayern Munich': '#DC052D',
  'Borussia Dortmund': '#FDE100', 'Bayer Leverkusen': '#CC0000',
  'RB Leipzig': '#CC0000', 'Eintracht Frankfurt': '#CC0000',
  'VfL Wolfsburg': '#65B32E', 'VfB Stuttgart': '#CC0000',
  'Werder Bremen': '#1D9053',
  // Ligue 1
  'PSG': '#003DA5', 'Paris Saint-Germain': '#003DA5', 'PSG W': '#003DA5',
  'Olympique Lyon': '#0033A0', 'Lyon W': '#0033A0',
  'Olympique de Marseille': '#009FC8', 'Marseille': '#009FC8',
  'Monaco': '#CC0000', 'AS Monaco': '#CC0000', 'Lille': '#CC0000',
  // Serie A
  'Inter de Milán': '#003DA5', 'Inter Milan': '#003DA5',
  'AC Milan': '#CC0000', 'Juventus': '#000000',
  'AS Roma': '#8B0000', 'Napoli': '#00BFFF',
  'Atalanta': '#1E3A8A', 'Fiorentina': '#6B21A8',
  'Lazio': '#5B9BD5', 'SS Lazio': '#5B9BD5', 'Bologna': '#CC0000',
  // Portugal
  'Benfica': '#CC0000', 'SL Benfica': '#CC0000',
  'Porto': '#003DA5', 'FC Porto': '#003DA5',
  'Sporting CP': '#006400',
  // Netherlands
  'Ajax': '#CC0000', 'PSV': '#CC0000', 'Feyenoord': '#CC0000',
  // Women's CL
  'VfL Wolfsburg W': '#65B32E', 'Bayern W': '#DC052D',
  // Motor sports
  'Marc Márquez': '#CC0000', 'Francesco Bagnaia': '#CC0000',
  'Jorge Martín': '#CC0000', 'Maverick Viñales': '#CC0000',
  'Pedro Acosta': '#1E3A8A', 'Fabio Quartararo': '#003DA5',
  'Enea Bastianini': '#CC0000',
  'Max Verstappen': '#1E3A8A', 'Lewis Hamilton': '#CC0000',
  'Charles Leclerc': '#CC0000', 'Fernando Alonso': '#006F62',
  'Carlos Sainz': '#CC0000', 'Lando Norris': '#FF8700',
  'George Russell': '#00D2BE', 'Oscar Piastri': '#FF8700',
  'Sergio Pérez': '#1E3A8A',
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
