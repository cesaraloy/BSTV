interface Props {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: { plus: 'text-lg', bar: 'text-base', sport: 'text-base', tv: 'text-sm' },
  md: { plus: 'text-2xl', bar: 'text-xl', sport: 'text-xl', tv: 'text-lg' },
  lg: { plus: 'text-4xl', bar: 'text-3xl', sport: 'text-3xl', tv: 'text-2xl' },
}

export default function Logo({ size = 'md', className = '' }: Props) {
  const s = sizeMap[size]
  return (
    <span className={`inline-flex items-baseline font-black tracking-tight select-none ${className}`}>
      <span className={`${s.plus} text-brand-blue`}>+</span>
      <span className={`${s.bar} text-brand-text`}>Bar</span>
      <span className={`${s.sport} text-brand-text font-semibold`}>Sport</span>
      <span className={`${s.tv} text-brand-blue font-black`}>TV</span>
    </span>
  )
}
