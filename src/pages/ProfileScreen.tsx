import { useState } from 'react'
import type React from 'react'
import { ChevronRight, LogOut, MapPin, Bell, Sun, Moon, Check, Edit3, X } from 'lucide-react'
import Logo from '../components/Logo'
import { useApp } from '../lib/context'

interface Props {
  onTeamsClick: () => void
  onSignOut?: () => void
  userPhone?: string
  userEmail?: string
}

export default function ProfileScreen({ onTeamsClick, onSignOut, userPhone, userEmail }: Props) {
  const { theme, toggleTheme, reminders, teams, userProfile, saveProfile } = useApp()
  const [editing, setEditing] = useState(false)
  const [draftName, setDraftName] = useState('')
  const [draftCity, setDraftCity] = useState('')

  const followedCount = teams.filter(t => t.enabled).length
  const reminderCount = reminders.size

  const displayName = userProfile.name || userEmail?.split('@')[0] || userPhone || 'Usuario'
  const displayCity = userProfile.location || 'Madrid, España'

  function startEdit() {
    setDraftName(userProfile.name || displayName)
    setDraftCity(displayCity)
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
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
              <button
                onClick={cancelEdit}
                className="w-9 h-9 rounded-full bg-brand-card border border-brand-border flex items-center justify-center"
              >
                <X size={16} className="text-brand-muted" />
              </button>
              <button
                onClick={confirmEdit}
                className="w-9 h-9 rounded-full bg-brand-navy flex items-center justify-center"
              >
                <Check size={16} className="text-white" />
              </button>
            </div>
          ) : (
            <button
              onClick={startEdit}
              className="w-9 h-9 rounded-full bg-brand-card border border-brand-border flex items-center justify-center"
            >
              <Edit3 size={16} className="text-brand-text" />
            </button>
          )}
        </div>
      </div>

      {/* Avatar + user info */}
      <div className="flex flex-col items-center px-5 pb-5">
        <div className="relative mb-3">
          <div className="w-24 h-24 rounded-full bg-gradient-to-b from-blue-600 to-brand-navy flex items-center justify-center border-2 border-brand-blue shadow-lg overflow-hidden">
            <Avatar3D />
          </div>
        </div>

        {editing ? (
          <div className="w-full max-w-xs flex flex-col gap-2 mt-1">
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
            <p className="text-sm text-brand-muted font-mono mt-0.5">
              {userEmail ?? userPhone ?? ''}
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-brand-muted">
              <MapPin size={11} />
              <span>{displayCity}</span>
            </div>
            <div className="mt-2 px-3 py-1 bg-brand-navy rounded-full">
              <Logo size="sm" />
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
        <button
          onClick={onTeamsClick}
          className="w-full bg-brand-card border border-brand-border rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition-transform text-left"
        >
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
          {/* Notifications row */}
          <SettingsRow icon={<Bell size={17} className="text-brand-muted" />} label="Notificaciones">
            <span className="text-xs text-brand-muted">Activadas</span>
            <ChevronRight size={15} className="text-brand-muted shrink-0" />
          </SettingsRow>
          <Divider />

          {/* Theme toggle */}
          <SettingsRow
            icon={theme === 'dark'
              ? <Moon size={17} className="text-brand-blue" />
              : <Sun size={17} className="text-brand-blue" />}
            label="Apariencia"
            onClick={toggleTheme}
          >
            <span className="text-xs text-brand-muted">{theme === 'dark' ? 'Oscuro' : 'Claro'}</span>
            <div className={`w-11 h-6 rounded-full relative transition-colors ${theme === 'light' ? 'bg-brand-navy' : 'bg-brand-border'}`}>
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${theme === 'light' ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
            </div>
          </SettingsRow>
        </div>

        {/* Logout */}
        <button
          onClick={onSignOut}
          className="w-full bg-brand-card border border-red-900/40 rounded-2xl p-4 flex items-center justify-center gap-2 mt-2 active:scale-[0.98] transition-transform"
        >
          <LogOut size={18} className="text-red-400" />
          <span className="text-sm font-semibold text-red-400">Cerrar sesión</span>
        </button>
      </div>
    </div>
  )
}

function SettingsRow({ icon, label, onClick, children }: {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  children?: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-brand-border/30 transition-colors"
    >
      <span className="shrink-0">{icon}</span>
      <span className="flex-1 text-sm text-brand-text text-left">{label}</span>
      <div className="flex items-center gap-2">{children}</div>
    </button>
  )
}

function Divider() {
  return <div className="ml-12 border-b border-brand-border" />
}

function Avatar3D() {
  return (
    <svg viewBox="0 0 96 96" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="60" width="56" height="40" rx="8" fill="#0b3aae" />
      <rect x="28" y="60" width="40" height="8" fill="#1a56db" />
      <text x="48" y="84" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="sans-serif">+BSportTV</text>
      <circle cx="48" cy="42" r="20" fill="#FBBF24" />
      <circle cx="41" cy="39" r="3" fill="#1F2937" />
      <circle cx="55" cy="39" r="3" fill="#1F2937" />
      <circle cx="42" cy="38" r="1" fill="white" />
      <circle cx="56" cy="38" r="1" fill="white" />
      <path d="M40 47 Q48 54 56 47" stroke="#1F2937" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M28 38 Q30 20 48 22 Q66 20 68 38" fill="#1F2937" />
    </svg>
  )
}
