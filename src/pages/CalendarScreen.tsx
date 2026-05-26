import { useState, useRef } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import MatchCard from '../components/MatchCard'
import { useApp } from '../lib/context'
import type { Match } from '../types'

const PTR_THRESHOLD = 64

const FILTERS = ['Todos', 'Mis equipos', 'Hoy', 'Mañana', 'LaLiga', 'Premier', 'Champions', 'Europa', 'Bundesliga', 'Serie A', 'Ligue 1', 'Mundial', 'Eurocopa']

const FILTER_MAP: Record<string, string> = {
  'LaLiga':     'LaLiga',
  'Premier':    'Premier League',
  'Champions':  'Champions League',
  'Europa':     'Europa League',
  'Bundesliga': 'Bundesliga',
  'Serie A':    'Serie A',
  'Ligue 1':    'Ligue 1',
  'Mundial':    'Mundial',
  'Eurocopa':   'Eurocopa',
}

interface Props {
  onMatchClick: (match: Match) => void
}

export default function CalendarScreen({ onMatchClick }: Props) {
  const { matches, reminders, toggleReminder, loading, teams, refreshMatches } = useApp()
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [pullY, setPullY] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef(0)

  function onTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0].clientY
  }

  function onTouchMove(e: React.TouchEvent) {
    if (isRefreshing) return
    const el = scrollRef.current
    if (!el || el.scrollTop > 0) return
    const delta = e.touches[0].clientY - touchStartY.current
    if (delta > 0) setPullY(Math.min(delta * 0.5, PTR_THRESHOLD + 16))
  }

  async function onTouchEnd() {
    if (pullY >= PTR_THRESHOLD) {
      setIsRefreshing(true)
      setPullY(PTR_THRESHOLD)
      await refreshMatches()
      setIsRefreshing(false)
    }
    setPullY(0)
  }

  const followedNames = new Set(teams.filter(t => t.enabled).map(t => t.name))

  const filtered = matches.filter(m => {
    if (activeFilter === 'Todos') return true
    if (activeFilter === 'Mis equipos') return followedNames.has(m.home_team) || followedNames.has(m.away_team)
    if (activeFilter === 'Hoy') return m.match_date === 'HOY'
    if (activeFilter === 'Mañana') return m.match_date === 'MAÑANA'
    const comp = FILTER_MAP[activeFilter]
    return comp ? m.competition === comp : true
  })

  const hasFollowed = followedNames.size > 0

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="pt-14 px-5 pb-3 bg-brand-bg">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-brand-text tracking-tight leading-6">Partidos</h1>
          <button className="w-9 h-9 rounded-full bg-brand-card border border-brand-border flex items-center justify-center">
            <SlidersHorizontal size={17} className="text-brand-text" />
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto chip-scroll pb-1 -mx-5 px-5">
          {FILTERS.map(f => {
            const isMisEquipos = f === 'Mis equipos'
            const disabled = isMisEquipos && !hasFollowed
            return (
              <button
                key={f}
                onClick={() => !disabled && setActiveFilter(f)}
                disabled={disabled}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  activeFilter === f
                    ? 'bg-brand-navy text-white'
                    : disabled
                      ? 'bg-brand-card border border-brand-border text-brand-border cursor-not-allowed'
                      : 'bg-brand-card border border-brand-border text-brand-muted'
                }`}
              >
                {f}
              </button>
            )
          })}
        </div>
      </div>

      {/* Pull-to-refresh indicator */}
      <div
        className="flex items-center justify-center overflow-hidden transition-all duration-200"
        style={{ height: pullY > 0 || isRefreshing ? Math.max(pullY, isRefreshing ? PTR_THRESHOLD : 0) : 0 }}
      >
        <svg
          className={`w-5 h-5 text-brand-blue ${isRefreshing ? 'animate-spin' : ''}`}
          style={{ transform: isRefreshing ? undefined : `rotate(${(pullY / PTR_THRESHOLD) * 360}deg)` }}
          viewBox="0 0 24 24" fill="none"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </div>

      {/* Scroll area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 pb-28"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="flex items-center justify-between mt-4 mb-3">
          <p className="text-xs font-bold text-brand-muted uppercase tracking-widest">
            {activeFilter === 'Mis equipos' ? 'Mis equipos' : 'Próximos partidos'}
          </p>
          {loading && (
            <div className="flex items-center gap-1.5 text-brand-muted">
              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span className="text-[10px]">Actualizando</span>
            </div>
          )}
        </div>

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
              {activeFilter === 'Mis equipos'
                ? 'Ninguno de tus equipos tiene partido próximamente'
                : 'No hay partidos para este filtro'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
