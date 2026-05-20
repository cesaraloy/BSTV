import { useApp } from '../lib/context'

const LOGO_DARK  = 'https://wgkxsvgutyzcsfsexgpn.supabase.co/storage/v1/object/public/images/masbarsport.png'
const LOGO_LIGHT = 'https://wgkxsvgutyzcsfsexgpn.supabase.co/storage/v1/object/public/images/masbarsport_light.png'

const heightMap = { sm: 'h-6', md: 'h-8', lg: 'h-12' }

interface Props {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Logo({ size = 'md', className = '' }: Props) {
  const { theme } = useApp()
  const src = theme === 'light' ? LOGO_DARK : LOGO_LIGHT
  return (
    <img
      src={src}
      alt="+BarSportTV"
      className={`${heightMap[size]} w-auto object-contain select-none ${className}`}
    />
  )
}
