import { Calendar, MapPin, User } from 'lucide-react'

interface Props {
  active: 'calendar' | 'map' | 'profile'
  onChange: (tab: 'calendar' | 'map' | 'profile') => void
}

const tabs = [
  { id: 'calendar' as const, label: 'Partidos', Icon: Calendar },
  { id: 'map' as const, label: 'Mapa', Icon: MapPin },
  { id: 'profile' as const, label: 'Perfil', Icon: User },
]

export default function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-brand-surface border-t border-brand-border safe-bottom">
      <div className="flex items-center justify-around px-4 pt-2 pb-safe">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex flex-col items-center gap-1 py-1 px-4 transition-colors"
            >
              <Icon
                size={24}
                strokeWidth={isActive ? 2.5 : 1.5}
                className={isActive ? 'text-brand-green' : 'text-brand-muted'}
              />
              <span
                className={`text-[10px] font-medium tracking-wide ${
                  isActive ? 'text-brand-green' : 'text-brand-muted'
                }`}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
