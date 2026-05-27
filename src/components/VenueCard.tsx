import { ChevronRight, Star, MapPin } from 'lucide-react'
import type { Venue } from '../types'
import { getVenueStatus } from '../lib/schedule'

interface Props {
  venue: Venue
  onClick: () => void
  compact?: boolean
}

export default function VenueCard({ venue, onClick, compact }: Props) {
  const status = venue.schedule
    ? getVenueStatus(venue.schedule)
    : { is_open: venue.is_open, open_until: venue.open_until, opens_at: null }

  const statusLabel = status.is_open
    ? `Abierto hasta ${status.open_until}`
    : status.opens_at
      ? `Abre a las ${status.opens_at}`
      : 'Cerrado'

  const statusColor = status.is_open
    ? 'text-brand-blue'
    : status.opens_at ? 'text-yellow-400' : 'text-red-400'

  return (
    <div
      onClick={onClick}
      className="bg-brand-card border border-brand-border rounded-2xl p-4 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform"
    >
      <div className="w-14 h-14 rounded-xl bg-brand-accent flex items-center justify-center shrink-0 overflow-hidden border border-brand-border">
        <span className="text-2xl">🍺</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-sm font-bold text-brand-text truncate">{venue.name}</span>
          {venue.distance && (
            <span className="text-xs text-brand-muted ml-2 shrink-0">{venue.distance}</span>
          )}
        </div>

        {!compact && (
          <div className="flex items-center gap-1 mb-1">
            <MapPin size={11} className="text-brand-muted" />
            <span className="text-xs text-brand-muted truncate">{venue.address}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-semibold ${statusColor}`}>
            {statusLabel}
          </span>
          <span className="text-brand-border">·</span>
          <div className="flex items-center gap-1">
            <Star size={11} className="text-yellow-400 fill-yellow-400" />
            <span className="text-[10px] text-brand-muted">{venue.rating} ({venue.reviews_count})</span>
          </div>
        </div>

        {!compact && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {venue.competitions.map(c => (
              <span key={c} className="text-[9px] bg-brand-accent text-brand-text px-1.5 py-0.5 rounded-full border border-brand-border">
                {c}
              </span>
            ))}
          </div>
        )}
      </div>

      <ChevronRight size={16} className="text-brand-muted shrink-0" />
    </div>
  )
}
