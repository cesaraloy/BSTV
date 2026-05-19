import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import MatchCard from '../components/MatchCard'
import { useApp } from '../lib/context'
import type { Match } from '../types'

const FILTERS = ['Todos', 'Hoy', 'Mañana', 'Esta semana', 'LaLiga', 'Champions', 'Premier']

interface Props {
  onMatchClick: (match: Match) => void
}

export default function CalendarScreen({ onMatchClick }: Props) {
  const { matches, reminders, toggleReminder } = useApp()
  const [activeFilter, setActiveFilter] = useState('Todos')

  const filtered = matches.filter(m => {
    if (activeFilter === 'Todos') return true
    if (activeFilter === 'Hoy') return m.match_date === 'HOY'
    if (activeFilter === 'Mañana') return m.match_date === 'MAÑANA'
    if (activeFilter === 'Esta semana') return true
    if (activeFilter === 'LaLiga') return m.competition.includes('LaLiga')
    if (activeFilter === 'Champions') return m.competition.includes('Champions')
    if (activeFilter === 'Premier') return m.competition.includes('Premier')
    return true
  })

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="pt-14 px-5 pb-3 bg-brand-bg">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white tracking-tight">Calendario de partidos</h1>
          <button className="w-9 h-9 rounded-full bg-brand-card border border-brand-border flex items-center justify-center">
            <SlidersHorizontal size={17} className="text-brand-text" />
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto chip-scroll pb-1 -mx-5 px-5">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                activeFilter === f
                  ? 'bg-brand-green text-brand-bg'
                  : 'bg-brand-card border border-brand-border text-brand-muted'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll area */}
      <div className="flex-1 overflow-y-auto px-5 pb-28">
        <p className="text-xs font-bold text-brand-muted uppercase tracking-widest mt-4 mb-3">
          Próximos partidos
        </p>

        <div className="flex flex-col gap-3">
          {filtered.map(match => (
            <MatchCard
              key={match.id}
              match={match}
              reminderActive={reminders.has(match.id)}
              onToggleReminder={() => toggleReminder(match.id)}
              onClick={() => onMatchClick(match)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-brand-muted text-sm py-12">
              No hay partidos para este filtro
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
