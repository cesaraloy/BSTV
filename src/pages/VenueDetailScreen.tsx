import { ArrowLeft, MapPin, Phone, Star, ExternalLink, ChevronRight, Clock } from 'lucide-react'
import { useApp } from '../lib/context'
import { getVenueStatus, formatSlots, DISPLAY_ORDER, DAY_LABELS } from '../lib/schedule'
import type { Venue, Match } from '../types'

interface Props {
  venue: Venue
  onBack: () => void
  onMatchClick: (match: Match) => void
}

export default function VenueDetailScreen({ venue, onBack, onMatchClick }: Props) {
  const { matches, reminders, venueMatches } = useApp()

  const relatedMatchIds = venueMatches[venue.id] ?? []
  const relatedMatches = matches.filter(m => relatedMatchIds.includes(m.id))

  const status = venue.schedule
    ? getVenueStatus(venue.schedule)
    : { is_open: venue.is_open, open_until: venue.open_until, opens_at: null }

  const statusLabel = status.is_open
    ? `Abierto hasta ${status.open_until}`
    : status.opens_at
      ? `Abre a las ${status.opens_at}`
      : 'Cerrado'

  const today = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][new Date().getDay()]

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-6">
      {/* Hero */}
      <div className="relative h-52 bg-gradient-to-b from-brand-navy to-brand-surface flex items-center justify-center">
        <span className="text-7xl">🍺</span>
        <button
          onClick={onBack}
          className="absolute top-14 left-5 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div className={`absolute bottom-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold ${
          status.is_open
            ? 'bg-brand-navy text-white border border-brand-blue'
            : status.opens_at
              ? 'bg-yellow-500/90 text-white'
              : 'bg-red-500/90 text-white'
        }`}>
          {statusLabel}
        </div>
      </div>

      {/* Info card */}
      <div className="mx-5 -mt-6 relative z-10">
        <div className="bg-brand-card border border-brand-border rounded-2xl p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-brand-text">{venue.name}</h1>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={12} className="text-brand-muted shrink-0" />
                <span className="text-xs text-brand-muted">{venue.address}, {venue.city}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-3">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-bold text-brand-text">{venue.rating}</span>
              <span className="text-xs text-brand-muted">({venue.reviews_count})</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {venue.competitions.map(c => (
              <span key={c} className="text-[11px] bg-brand-accent border border-brand-border text-brand-text px-2.5 py-1 rounded-full font-medium">
                {c}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-2 py-3 bg-brand-navy rounded-xl font-semibold text-sm text-white">
              <ExternalLink size={15} />
              Cómo llegar
            </button>
            <button className="flex items-center justify-center gap-2 py-3 bg-brand-accent border border-brand-border rounded-xl font-semibold text-sm text-brand-text">
              <Phone size={15} />
              Llamar
            </button>
          </div>
        </div>
      </div>

      {/* Schedule */}
      {venue.schedule && (
        <div className="px-5 mt-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={13} className="text-brand-muted" />
            <p className="text-xs font-bold text-brand-muted uppercase tracking-widest">Horario</p>
          </div>
          <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
            {DISPLAY_ORDER.map((key, i) => {
              const isToday = key === today
              const slots = venue.schedule![key]
              return (
                <div
                  key={key}
                  className={`flex items-center justify-between px-4 py-3 ${
                    isToday ? 'bg-brand-navy/10' : ''
                  } ${i < DISPLAY_ORDER.length - 1 ? 'border-b border-brand-border' : ''}`}
                >
                  <span className={`text-sm font-semibold w-28 ${isToday ? 'text-brand-blue' : 'text-brand-text'}`}>
                    {DAY_LABELS[key]}
                    {isToday && <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wide text-brand-blue">hoy</span>}
                  </span>
                  <span className={`text-sm text-right ${
                    !slots || slots.length === 0 ? 'text-brand-muted' : isToday ? 'text-brand-blue font-medium' : 'text-brand-text'
                  }`}>
                    {formatSlots(slots)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Upcoming matches */}
      <div className="px-5 mt-5">
        <p className="text-xs font-bold text-brand-muted uppercase tracking-widest mb-3">
          Próximos partidos que emite
        </p>

        {relatedMatches.length === 0 ? (
          <div className="text-center text-brand-muted text-sm py-8 bg-brand-card border border-brand-border rounded-2xl">
            Sin partidos programados
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {relatedMatches.map(match => {
              const isReminder = reminders.has(match.id)
              return (
                <button
                  key={match.id}
                  onClick={() => onMatchClick(match)}
                  className="w-full bg-brand-card border border-brand-border rounded-2xl p-3.5 flex items-center gap-3 active:scale-[0.98] transition-transform text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-brand-accent border border-brand-border flex items-center justify-center shrink-0">
                    <span className="text-sm">⚽</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-brand-text truncate">
                      {match.home_team} vs {match.away_team}
                    </p>
                    <p className="text-[11px] text-brand-muted">{match.competition}</p>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-0.5">
                    <span className="text-xs font-bold text-brand-blue">{match.match_time}</span>
                    <span className="text-[10px] text-brand-muted">{match.match_date}</span>
                    {isReminder && <span className="text-[9px] text-brand-blue">🔔</span>}
                  </div>
                  <ChevronRight size={14} className="text-brand-muted ml-1" />
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
