import { Bell, ChevronRight } from 'lucide-react'
import TeamLogo, { CompetitionLogo } from './TeamLogo'
import type { Match } from '../types'

interface Props {
  match: Match
  reminderActive: boolean
  onToggleReminder: () => void
  onClick: () => void
}

const dateBadgeStyle: Record<string, string> = {
  HOY:    'bg-brand-blue/20 text-brand-blue',
  MAÑANA: 'bg-brand-blue/10 text-brand-blue',
}

export default function MatchCard({ match, reminderActive, onToggleReminder, onClick }: Props) {
  const badgeClass = dateBadgeStyle[match.match_date] ?? 'bg-white/10 text-brand-muted'

  return (
    <div
      onClick={onClick}
      className="bg-brand-card border border-brand-border rounded-2xl p-4 flex flex-col gap-3 cursor-pointer active:scale-[0.98] transition-transform"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CompetitionLogo name={match.competition} size={18} />
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
              className={reminderActive ? 'text-brand-blue' : 'text-brand-muted'}
              style={reminderActive ? { filter: 'drop-shadow(0 0 4px #5b8def66)' } : {}}
            />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <TeamSlot name={match.home_team} logoUrl={match.home_team_logo} />
          <div className="flex flex-col items-center shrink-0">
            <span className="text-2xl font-bold text-brand-text tracking-tight">{match.match_time}</span>
            <span className="text-[10px] text-brand-muted font-medium">VS</span>
          </div>
          <TeamSlot name={match.away_team} logoUrl={match.away_team_logo} right />
        </div>
        <ChevronRight size={16} className="text-brand-muted ml-2 shrink-0" />
      </div>
    </div>
  )
}

function TeamSlot({ name, logoUrl, right }: { name: string; logoUrl?: string; right?: boolean }) {
  return (
    <div className={`flex items-center gap-2 flex-1 min-w-0 ${right ? 'flex-row-reverse' : ''}`}>
      <TeamLogo name={name} logoUrl={logoUrl} size="sm" />
      <span className={`text-xs font-semibold text-brand-text truncate ${right ? 'text-right' : 'text-left'}`}>
        {name}
      </span>
    </div>
  )
}
