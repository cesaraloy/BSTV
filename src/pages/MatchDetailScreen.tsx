import { ArrowLeft, Bell, MapPin, ChevronRight } from 'lucide-react'
import { useApp } from '../lib/context'
import { competitionEmojis, venueMatchRelations } from '../data/demo'
import type { Match, Venue } from '../types'

interface Props {
  match: Match
  onBack: () => void
  onVenueClick: (venue: Venue) => void
}

export default function MatchDetailScreen({ match, onBack, onVenueClick }: Props) {
  const { reminders, toggleReminder, venues } = useApp()
  const reminderActive = reminders.has(match.id)

  const relatedVenueIds = venueMatchRelations[match.id] ?? []
  const relatedVenues = venues.filter(v => relatedVenueIds.includes(v.id))
  const emoji = competitionEmojis[match.competition] ?? '🏆'

  const homeInitials = match.home_team.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase()
  const awayInitials = match.away_team.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase()

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-6">
      {/* Header */}
      <div className="pt-14 px-5 pb-4 bg-brand-bg sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-brand-card border border-brand-border flex items-center justify-center">
            <ArrowLeft size={18} className="text-brand-text" />
          </button>
          <span className="text-sm text-brand-muted">Detalle del partido</span>
        </div>
      </div>

      {/* Match hero */}
      <div className="mx-5 mb-4">
        <div className="bg-brand-card border border-brand-border rounded-2xl p-5">
          {/* Competition */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-lg">{emoji}</span>
            <span className="text-sm font-semibold text-brand-muted">{match.competition}</span>
          </div>

          {/* Teams */}
          <div className="flex items-center justify-between mb-4">
            <TeamHero name={match.home_team} initials={homeInitials} />
            <div className="flex flex-col items-center px-4">
              <span className="text-3xl font-black text-white tracking-tight">{match.match_time}</span>
              <span className="text-xs text-brand-muted mt-1 font-medium">VS</span>
              <span className="text-sm font-semibold text-brand-green mt-1">{match.match_date}</span>
            </div>
            <TeamHero name={match.away_team} initials={awayInitials} right />
          </div>

          {/* Reminder button */}
          <button
            onClick={() => toggleReminder(match.id)}
            className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-colors ${
              reminderActive
                ? 'bg-brand-green/10 border border-brand-green text-brand-green'
                : 'bg-brand-accent border border-brand-border text-brand-text'
            }`}
          >
            <Bell size={16} strokeWidth={2} className={reminderActive ? 'fill-brand-green/30' : ''} />
            {reminderActive ? 'Recordatorio activado' : 'Activar recordatorio'}
          </button>
        </div>
      </div>

      {/* Venues section */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-brand-muted uppercase tracking-widest">
            Bares donde verlo
          </p>
          {relatedVenues.length > 0 && (
            <button className="flex items-center gap-1 text-xs text-brand-green font-semibold">
              <MapPin size={12} />
              Ver en mapa
            </button>
          )}
        </div>

        {relatedVenues.length === 0 ? (
          <div className="text-center text-brand-muted text-sm py-8 bg-brand-card border border-brand-border rounded-2xl">
            No hay bares registrados para este partido
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {relatedVenues.map(venue => (
              <button
                key={venue.id}
                onClick={() => onVenueClick(venue)}
                className="w-full bg-brand-card border border-brand-border rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition-transform text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-accent flex items-center justify-center shrink-0">
                  <span className="text-lg">🍺</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">{venue.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin size={10} className="text-brand-muted" />
                    <span className="text-xs text-brand-muted truncate">{venue.address}</span>
                  </div>
                  <span className={`text-[10px] font-semibold ${venue.is_open ? 'text-brand-green' : 'text-red-400'}`}>
                    {venue.is_open ? `Abierto hasta ${venue.open_until}` : 'Cerrado'}
                  </span>
                </div>
                <ChevronRight size={15} className="text-brand-muted shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function TeamHero({ name, initials, right }: { name: string; initials: string; right?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-2 flex-1 ${right ? '' : ''}`}>
      <div className="w-16 h-16 rounded-2xl bg-brand-accent flex items-center justify-center">
        <span className="text-sm font-black text-white">{initials}</span>
      </div>
      <span className="text-xs font-bold text-white text-center leading-tight max-w-[80px]">{name}</span>
    </div>
  )
}
