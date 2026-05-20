export const AVATARS = [
  { emoji: '⚽', from: '#1a56db', to: '#0b3aae', label: 'Balón' },
  { emoji: '🏆', from: '#d97706', to: '#92400e', label: 'Campeón' },
  { emoji: '🍺', from: '#b45309', to: '#78350f', label: 'Barra' },
  { emoji: '📺', from: '#7c3aed', to: '#4c1d95', label: 'Televidente' },
  { emoji: '🎽', from: '#dc2626', to: '#7f1d1d', label: 'Hincha' },
  { emoji: '🏟️', from: '#059669', to: '#064e3b', label: 'Estadio' },
]

interface AvatarProps {
  index: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizePx = { sm: 40, md: 64, lg: 96 }
const emojSize = { sm: '1.1rem', md: '1.8rem', lg: '2.6rem' }

export function AvatarPreset({ index, size = 'md', className = '' }: AvatarProps) {
  const av = AVATARS[index] ?? AVATARS[0]
  const px = sizePx[size]
  return (
    <div
      className={`rounded-full flex items-center justify-center shrink-0 ${className}`}
      style={{
        width: px,
        height: px,
        background: `linear-gradient(135deg, ${av.from}, ${av.to})`,
        border: '2px solid rgba(255,255,255,0.15)',
      }}
    >
      <span style={{ fontSize: emojSize[size], lineHeight: 1 }}>{av.emoji}</span>
    </div>
  )
}

interface PickerProps {
  selected: number
  onChange: (i: number) => void
}

export function AvatarPicker({ selected, onChange }: PickerProps) {
  return (
    <div className="flex justify-center gap-3 flex-wrap">
      {AVATARS.map((av, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className="relative"
          title={av.label}
        >
          <AvatarPreset index={i} size="md" />
          {selected === i && (
            <div className="absolute inset-0 rounded-full ring-2 ring-brand-blue ring-offset-2 ring-offset-brand-bg" />
          )}
        </button>
      ))}
    </div>
  )
}
