const BASE = 'https://wgkxsvgutyzcsfsexgpn.supabase.co/storage/v1/object/public/images/'

// 0-8 → M1-M9 | 9-17 → F1-F9
export const AVATARS = [
  ...Array.from({ length: 9 }, (_, i) => `${BASE}M${i + 1}.png`),
  ...Array.from({ length: 9 }, (_, i) => `${BASE}F${i + 1}.png`),
]

const sizes = {
  xs: 'w-8 h-8',
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-20 h-20',
  xl: 'w-24 h-24',
}

interface AvatarProps {
  index: number
  size?: keyof typeof sizes
  className?: string
}

export function AvatarPreset({ index, size = 'md', className = '' }: AvatarProps) {
  return (
    <img
      src={AVATARS[index] ?? AVATARS[0]}
      alt="avatar"
      className={`rounded-full object-cover shrink-0 ${sizes[size]} ${className}`}
    />
  )
}
