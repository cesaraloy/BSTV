import { useState } from 'react'

export const teamLogos: Record<string, string> = {
  // LaLiga Hypermotion
  'Real Zaragoza':    'https://upload.wikimedia.org/wikipedia/en/9/92/Real_Zaragoza.svg',
  'SD Eibar':         'https://upload.wikimedia.org/wikipedia/en/f/f2/SDEibar.svg',
  'Athletic Club':    'https://upload.wikimedia.org/wikipedia/en/9/98/Club_Athletic_de_Bilbao_logo.svg',
  'Espanyol':         'https://upload.wikimedia.org/wikipedia/en/7/74/Rcd_espanyol_logo.svg',
  'Levante UD':       'https://upload.wikimedia.org/wikipedia/en/1/12/Levante_UD.svg',
  // Champions League
  'Real Madrid':      'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg',
  'FC Barcelona':     'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg',
  'Arsenal':          'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
  'Bayern Múnich':    'https://upload.wikimedia.org/wikipedia/commons/c/c5/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg',
  'PSG':              'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg',
  // Europa League
  'Atlético de Madrid': 'https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg',
  'Lazio':            'https://upload.wikimedia.org/wikipedia/en/b/bd/Lazio.svg',
  // Women's CL
  'FC Barcelona W':   'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg',
  'Chelsea W':        'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
  'Manchester Utd W': 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg',
  'Lyon W':           'https://upload.wikimedia.org/wikipedia/en/e/e9/Olympique_Lyonnais_%28logo%29.svg',
  // Motor sports – manufacturer / team logos
  'Marc Márquez':       'https://upload.wikimedia.org/wikipedia/commons/9/9c/Ducati_red_logo.svg',
  'Francesco Bagnaia':  'https://upload.wikimedia.org/wikipedia/commons/9/9c/Ducati_red_logo.svg',
  'Max Verstappen':     'https://upload.wikimedia.org/wikipedia/en/5/5c/Red_Bull_Racing_logo.svg',
  'Lewis Hamilton':     'https://upload.wikimedia.org/wikipedia/en/d/d1/Ferrari-Logo.svg',
}

export const teamColors: Record<string, string> = {
  'Real Zaragoza':        '#003DA5',
  'SD Eibar':             '#003DA5',
  'Athletic Club':        '#EE2A24',
  'Espanyol':             '#003DA5',
  'Levante UD':           '#0033A0',
  'Real Madrid':          '#00529F',
  'FC Barcelona':         '#A50044',
  'FC Barcelona W':       '#A50044',
  'Arsenal':              '#EF0107',
  'Bayern Múnich':        '#DC052D',
  'PSG':                  '#003DA5',
  'Atlético de Madrid':   '#CB3524',
  'Lazio':                '#5B9BD5',
  'Chelsea':              '#034694',
  'Chelsea W':            '#034694',
  'Manchester Utd W':     '#DA291C',
  'Lyon W':               '#0033A0',
  'Marc Márquez':         '#CC0000',
  'Francesco Bagnaia':    '#CC0000',
  'Max Verstappen':       '#1E3A8A',
  'Lewis Hamilton':       '#CC0000',
}

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
  const initials = name.split(' ').filter(w => /^[A-ZÁÉÍÓÚÑ]/i.test(w)).map(w => w[0]).join('').slice(0, 2).toUpperCase()
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
