import { ChevronRight, Edit3, LogOut, MapPin, Bell, Settings, HelpCircle, Shield, FileText } from 'lucide-react'

interface Props {
  onTeamsClick: () => void
}

const settingsItems = [
  { icon: MapPin, label: 'Ubicación predeterminada', value: 'Madrid, España' },
  { icon: Bell, label: 'Notificaciones', value: '' },
  { icon: Settings, label: 'Ajustes de la aplicación', value: '' },
  { icon: HelpCircle, label: 'Ayuda y soporte', value: '' },
  { icon: Shield, label: 'Política de privacidad', value: '' },
  { icon: FileText, label: 'Términos y condiciones', value: '' },
]

export default function ProfileScreen({ onTeamsClick }: Props) {
  return (
    <div className="flex flex-col h-full overflow-y-auto pb-28">
      {/* Header */}
      <div className="pt-14 px-5 pb-4 bg-brand-bg">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white tracking-tight">Perfil</h1>
          <button className="w-9 h-9 rounded-full bg-brand-card border border-brand-border flex items-center justify-center">
            <Edit3 size={16} className="text-brand-text" />
          </button>
        </div>
      </div>

      {/* Avatar + user info */}
      <div className="flex flex-col items-center px-5 pb-6">
        <div className="relative mb-3">
          <div className="w-24 h-24 rounded-full bg-gradient-to-b from-blue-500 to-blue-700 flex items-center justify-center border-2 border-brand-green shadow-lg overflow-hidden">
            <Avatar3D />
          </div>
          <div className="absolute bottom-0 right-0 w-7 h-7 bg-brand-green rounded-full flex items-center justify-center border-2 border-brand-bg">
            <Edit3 size={12} className="text-brand-bg" />
          </div>
        </div>
        <p className="text-lg font-bold text-white">Juan Pérez</p>
        <p className="text-sm text-brand-muted">juanperez@email.com</p>
        <div className="mt-2 px-3 py-1 bg-brand-accent rounded-full">
          <span className="text-[10px] font-bold text-brand-green tracking-wider">+BarSportTV</span>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-3">
        {/* Teams card */}
        <button
          onClick={onTeamsClick}
          className="w-full bg-brand-card border border-brand-border rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition-transform text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center">
            <span className="text-xl">🏆</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white">Equipos que estoy siguiendo</p>
            <p className="text-xs text-brand-muted mt-0.5">Selecciona los equipos que quieres seguir</p>
          </div>
          <ChevronRight size={18} className="text-brand-muted shrink-0" />
        </button>

        {/* Divider label */}
        <p className="text-xs font-bold text-brand-muted uppercase tracking-widest mt-2 mb-1">Ajustes</p>

        {/* Settings list */}
        <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
          {settingsItems.map(({ icon: Icon, label, value }, i) => (
            <div key={label}>
              <button className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-brand-border/30 transition-colors">
                <Icon size={17} className="text-brand-muted shrink-0" />
                <span className="flex-1 text-sm text-brand-text text-left">{label}</span>
                {value && <span className="text-xs text-brand-muted">{value}</span>}
                <ChevronRight size={15} className="text-brand-muted shrink-0" />
              </button>
              {i < settingsItems.length - 1 && (
                <div className="ml-12 border-b border-brand-border" />
              )}
            </div>
          ))}
        </div>

        {/* Logout */}
        <button className="w-full bg-brand-card border border-red-900/40 rounded-2xl p-4 flex items-center justify-center gap-2 mt-2 active:scale-[0.98] transition-transform">
          <LogOut size={18} className="text-red-400" />
          <span className="text-sm font-semibold text-red-400">Cerrar sesión</span>
        </button>
      </div>
    </div>
  )
}

function Avatar3D() {
  return (
    <svg viewBox="0 0 96 96" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Body - jersey */}
      <rect x="20" y="60" width="56" height="40" rx="8" fill="#1E40AF" />
      <rect x="28" y="60" width="40" height="8" fill="#1D4ED8" />
      {/* Number */}
      <text x="48" y="84" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="sans-serif">+BST</text>
      {/* Head */}
      <circle cx="48" cy="42" r="20" fill="#FBBF24" />
      {/* Eyes */}
      <circle cx="41" cy="39" r="3" fill="#1F2937" />
      <circle cx="55" cy="39" r="3" fill="#1F2937" />
      <circle cx="42" cy="38" r="1" fill="white" />
      <circle cx="56" cy="38" r="1" fill="white" />
      {/* Smile */}
      <path d="M40 47 Q48 54 56 47" stroke="#1F2937" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Hair */}
      <path d="M28 38 Q30 20 48 22 Q66 20 68 38" fill="#1F2937" />
    </svg>
  )
}
