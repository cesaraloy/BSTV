import { Bell, ChevronRight } from 'lucide-react'
import { competitionEmojis } from '../data/demo'
import type { Match } from '../types'

interface Props {
  match: Match
  reminderActive: boolean
  onToggleReminder: () => void
  onClick: () => void
}

const dateBadgeStyle: Record<string, string> = {
  HOY: 'bg-brand-green/20 text-brand-green',
  MAÑANA: 'bg-blue-500/20 text-blue-400',
}

export default function MatchCard({ match, reminderActive, onToggleReminder, onClick }: Props) {
  const emoji = competitionEmojis[match.competition] ?? '🏆'
  const badgeClass = dateBadgeStyle[match.match_date] ?? 'bg-white/10 text-brand-muted'

  return (
    <div
      onClick={onClick}
      className="bg-brand-card border border-brand-border rounded-2xl p-4 flex flex-col gap-3 cursor-pointer active:scale-[0.98] transition-transform"
    >
      {/* Top row: competition + date + bell */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{emoji}</span>
          <span className="text-xs text-brand-muted font-medium">{match.competition}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
            {match.match_date}
          </span>
          <button
            onClick={e => { e.stopPropagation(); onToggleReminder() }}
            className="p-1.5 rounded-full"
          >
            <Bell
              size={18}
              strokeWidth={1.8}
              className={reminderActive ? 'text-brand-green fill-brand-green/30' : 'text-brand-muted'}
            />
          </button>
        </div>
      </div>

      {/* Teams row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <TeamBadge name={match.home_team} />
          <div className="flex flex-col items-center shrink-0">
            <span className="text-2xl font-bold text-white tracking-tight">{match.match_time}</span>
            <span className="text-[10px] text-brand-muted font-medium">VS</span>
          </div>
          <TeamBadge name={match.away_team} right />
        </div>
        <ChevronRight size={16} className="text-brand-muted ml-2 shrink-0" />
      </div>
    </div>
  )
}

function TeamBadge({ name, right }: { name: string; right?: boolean }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase()
  return (
    <div className={`flex items-center gap-2 flex-1 min-w-0 ${right ? 'flex-row-reverse' : ''}`}>
      <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center shrink-0">
        <span className="text-[9px] font-bold text-white">{initials}</span>
      </div>
      <span className={`text-xs font-semibold text-brand-text truncate ${right ? 'text-right' : 'text-left'}`}>
        {name}
      </span>
    </div>
  )
}
