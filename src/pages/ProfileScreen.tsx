import { useState } from 'react'
import { ChevronRight, LogOut, MapPin, Bell, Sun, Moon, Check, Edit3, X, HelpCircle } from 'lucide-react'
import Logo from '../components/Logo'
import { AvatarPreset } from '../components/AvatarPreset'
import { useApp } from '../lib/context'

interface Props {
  onTeamsClick: () => void
  onFAQClick: () => void
  onAvatarClick: () => void
  onSignOut?: () => void
  userPhone?: string
  userEmail?: string
}

const ADVANCE_OPTIONS = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '1 hora', value: 60 },
]

export default function ProfileScreen({ onTeamsClick, onFAQClick, onAvatarClick, onSignOut, userPhone, userEmail }: Props) {
  const { theme, toggleTheme, reminders, teams, userProfile, avatarPreset, notifAdvance, saveProfile, setNotifAdvance } = useApp()
  const [editing, setEditing] = useState(false)
  const [draftName, setDraftName] = useState('')
  const [draftCity, setDraftCity] = useState('')
  const [showNotifPicker, setShowNotifPicker] = useState(false)

  const followedCount = teams.filter(t => t.enabled).length
  const reminderCount = reminders.size

  const displayName = userProfile.name || userEmail?.split('@')[0] || userPhone || 'Usuario'
  const displayCity = userProfile.location || 'Madrid, España'

  function startEdit() {
    setDraftName(userProfile.name || displayName)
    setDraftCity(displayCity)
    setEditing(true)
  }

  function confirmEdit() {
    saveProfile(draftName.trim() || displayName, draftCity.trim() || displayCity)
    setEditing(false)
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-28">
      {/* Header */}
      <div className="pt-14 px-5 pb-4 bg-brand-bg">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-brand-text tracking-tight">Perfil</h1>
          {editing ? (
            <div className="flex items-center gap-2">
              <button onClick={() => setEditing(false)} className="w-9 h-9 rounded-full bg-brand-card border border-brand-border flex items-center justify-center">
                <X size={16} className="text-brand-muted" />
              </button>
              <button onClick={confirmEdit} className="w-9 h-9 rounded-full bg-brand-navy flex items-center justify-center">
                <Check size={16} className="text-white" />
              </button>
            </div>
          ) : (
            <button onClick={startEdit} className="w-9 h-9 rounded-full bg-brand-card border border-brand-border flex items-center justify-center">
              <Edit3 size={16} className="text-brand-text" />
            </button>
          )}
        </div>
      </div>

      {/* Avatar + user info */}
      <div className="flex flex-col items-center px-5 pb-5">
        <div className="relative mb-3">
          <button onClick={onAvatarClick}>
            <AvatarPreset index={avatarPreset} size="lg" />
          </button>
          <div className="absolute bottom-0 right-0 w-7 h-7 bg-brand-navy rounded-full flex items-center justify-center border-2 border-brand-bg pointer-events-none">
            <Edit3 size={11} className="text-white" />
          </div>
        </div>

        {editing ? (
          <div className="w-full max-w-xs flex flex-col gap-2">
            <input
              autoFocus
              value={draftName}
              onChange={e => setDraftName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full bg-brand-card border border-brand-blue rounded-xl px-4 py-2.5 text-center text-base font-bold text-brand-text outline-none"
            />
            <div className="flex items-center gap-2 bg-brand-card border border-brand-border rounded-xl px-3 py-2.5">
              <MapPin size={14} className="text-brand-muted shrink-0" />
              <input
                value={draftCity}
                onChange={e => setDraftCity(e.target.value)}
                placeholder="Ciudad"
                className="flex-1 bg-transparent text-sm text-brand-text outline-none text-center"
              />
            </div>
          </div>
        ) : (
          <>
            <p className="text-lg font-bold text-brand-text">{displayName}</p>
            <p className="text-sm text-brand-muted font-mono mt-0.5">{userEmail ?? userPhone ?? ''}</p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-brand-muted">
              <MapPin size={11} /><span>{displayCity}</span>
            </div>
          </>
        )}
      </div>

      {/* Stats strip */}
      {!editing && (
        <div className="mx-5 mb-4 grid grid-cols-2 gap-3">
          <div className="bg-brand-card border border-brand-border rounded-2xl p-4 flex flex-col items-center gap-1">
            <span className="text-2xl font-black text-brand-blue">{reminderCount}</span>
            <span className="text-xs text-brand-muted font-medium">Recordatorios</span>
          </div>
          <div className="bg-brand-card border border-brand-border rounded-2xl p-4 flex flex-col items-center gap-1">
            <span className="text-2xl font-black text-brand-blue">{followedCount}</span>
            <span className="text-xs text-brand-muted font-medium">Equipos seguidos</span>
          </div>
        </div>
      )}

      <div className="px-5 flex flex-col gap-3">
        {/* Teams card */}
        <button onClick={onTeamsClick} className="w-full bg-brand-card border border-brand-border rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition-transform text-left">
          <div className="w-10 h-10 rounded-xl bg-brand-navy/20 border border-brand-blue/20 flex items-center justify-center">
            <span className="text-xl">🏆</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-brand-text">Equipos que sigo</p>
            <p className="text-xs text-brand-muted mt-0.5">
              {followedCount > 0 ? `${followedCount} equipos seleccionados` : 'Selecciona los equipos que quieres seguir'}
            </p>
          </div>
          <ChevronRight size={18} className="text-brand-muted shrink-0" />
        </button>

        <p className="text-xs font-bold text-brand-muted uppercase tracking-widest mt-1 mb-1">Ajustes</p>

        <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
          {/* Notifications */}
          <button onClick={() => setShowNotifPicker(p => !p)} className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-brand-border/30 transition-colors">
            <Bell size={17} className="text-brand-muted shrink-0" />
            <span className="flex-1 text-sm text-brand-text text-left">Notificaciones</span>
            <span className="text-xs text-brand-muted">
              {ADVANCE_OPTIONS.find(o => o.value === notifAdvance)?.label ?? '30 min'} antes
            </span>
            <ChevronRight size={15} className={`text-brand-muted shrink-0 transition-transform ${showNotifPicker ? 'rotate-90' : ''}`} />
          </button>
          {showNotifPicker && (
            <div className="px-4 pb-4 flex gap-2">
              {ADVANCE_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => { setNotifAdvance(opt.value); setShowNotifPicker(false) }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors border ${notifAdvance === opt.value ? 'bg-brand-navy border-brand-blue text-white' : 'bg-brand-accent border-brand-border text-brand-muted'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          <div className="ml-12 border-b border-brand-border" />

          {/* Theme toggle */}
          <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-brand-border/30 transition-colors">
            {theme === 'dark' ? <Moon size={17} className="text-brand-blue shrink-0" /> : <Sun size={17} className="text-brand-blue shrink-0" />}
            <span className="flex-1 text-sm text-brand-text text-left">Apariencia</span>
            <span className="text-xs text-brand-muted">{theme === 'dark' ? 'Oscuro' : 'Claro'}</span>
            <div className={`w-11 h-6 rounded-full relative transition-colors ${theme === 'light' ? 'bg-brand-navy' : 'bg-brand-border'}`}>
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${theme === 'light' ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
            </div>
          </button>

          <div className="ml-12 border-b border-brand-border" />

          {/* FAQ */}
          <button onClick={onFAQClick} className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-brand-border/30 transition-colors">
            <HelpCircle size={17} className="text-brand-muted shrink-0" />
            <span className="flex-1 text-sm text-brand-text text-left">Preguntas frecuentes</span>
            <ChevronRight size={15} className="text-brand-muted shrink-0" />
          </button>
        </div>

        <div className="flex justify-center py-2 opacity-40">
          <Logo size="sm" />
        </div>

        <button onClick={onSignOut} className="w-full bg-brand-card border border-red-900/40 rounded-2xl p-4 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
          <LogOut size={18} className="text-red-400" />
          <span className="text-sm font-semibold text-red-400">Cerrar sesión</span>
        </button>
      </div>
    </div>
  )
}
