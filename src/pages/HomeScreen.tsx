import { Bell, ChevronRight, MapPin, Calendar } from 'lucide-react'
import { useApp } from '../lib/context'
import TeamLogo, { CompetitionLogo } from '../components/TeamLogo'
import Logo from '../components/Logo'
import { competitionColors } from '../data/demo'
import type { Match, Venue } from '../types'

interface Props {
  onMatchClick: (match: Match) => void
  onVenueClick: (venue: Venue) => void
  onAllMatchesClick: () => void
  onMapClick: () => void
}

export default function HomeScreen({ onMatchClick, onAllMatchesClick, onMapClick }: Props) {
  const { matches, teams, reminders, toggleReminder, user, userProfile } = useApp()

  const todayMatches  = matches.filter(m => m.match_date === 'HOY')
  const featuredMatch = matches.find(m => m.is_featured) ?? todayMatches[0] ?? matches[0]

  const reminderMatches = matches.filter(m => reminders.has(m.id)).slice(0, 4)

  const followedNames = new Set(teams.filter(t => t.enabled).map(t => t.name))
  const myTeamMatches = matches
    .filter(m => followedNames.has(m.home_team) || followedNames.has(m.away_team))
    .slice(0, 4)

  const displayName = userProfile.name || user?.email?.split('@')[0] || user?.phone || null
  const greeting = displayName ? `Hola, ${displayName} 👋` : 'Bienvenido 👋'

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-28">
      {/* Header */}
      <div className="pt-14 px-5 pb-4">
        <Logo size="sm" className="mb-1" />
        <h1 className="text-xl font-bold text-brand-text">{greeting}</h1>
      </div>

      {/* Ad banner — replace src with your image URL from Supabase Storage */}
      <AdBanner />

      {/* Featured match */}
      {featuredMatch && (
        <div className="px-5 mb-5">
          <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-2">
            Partido destacado
          </p>
          <FeaturedCard
            match={featuredMatch}
            reminderActive={reminders.has(featuredMatch.id)}
            onToggle={() => toggleReminder(featuredMatch.id)}
            onClick={() => onMatchClick(featuredMatch)}
          />
        </div>
      )}

      {/* Today's matches */}
      {todayMatches.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between px-5 mb-2">
            <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">
              Hoy · {todayMatches.length} partidos
            </p>
            <button onClick={onAllMatchesClick} className="flex items-center gap-1 text-xs text-brand-blue font-semibold">
              Ver todos <ChevronRight size={12} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto chip-scroll pb-1 px-5">
            {todayMatches.map(m => (
              <MiniMatchCard
                key={m.id}
                match={m}
                reminderActive={reminders.has(m.id)}
                onToggle={() => toggleReminder(m.id)}
                onClick={() => onMatchClick(m)}
              />
            ))}
          </div>
        </div>
      )}

      {/* My reminders */}
      {reminderMatches.length > 0 && (
        <div className="px-5 mb-5">
          <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-2">
            Mis recordatorios
          </p>
          <div className="flex flex-col gap-2">
            {reminderMatches.map(m => (
              <CompactMatchRow
                key={m.id}
                match={m}
                reminderActive
                onToggle={() => toggleReminder(m.id)}
                onClick={() => onMatchClick(m)}
              />
            ))}
          </div>
        </div>
      )}

      {/* My teams' matches */}
      {myTeamMatches.length > 0 && (
        <div className="px-5 mb-5">
          <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-2">
            Mis equipos
          </p>
          <div className="flex flex-col gap-2">
            {myTeamMatches.map(m => (
              <CompactMatchRow
                key={m.id}
                match={m}
                reminderActive={reminders.has(m.id)}
                onToggle={() => toggleReminder(m.id)}
                onClick={() => onMatchClick(m)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="px-5 grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={onAllMatchesClick}
          className="bg-brand-card border border-brand-border rounded-2xl p-4 flex items-center gap-3 active:scale-[0.97] transition-transform"
        >
          <div className="w-9 h-9 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0">
            <Calendar size={18} className="text-brand-blue" />
          </div>
          <span className="text-sm font-semibold text-brand-text">Todos los partidos</span>
        </button>
        <button
          onClick={onMapClick}
          className="bg-brand-card border border-brand-border rounded-2xl p-4 flex items-center gap-3 active:scale-[0.97] transition-transform"
        >
          <div className="w-9 h-9 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0">
            <MapPin size={18} className="text-brand-blue" />
          </div>
          <span className="text-sm font-semibold text-brand-text">Buscar bar</span>
        </button>
      </div>
    </div>
  )
}

// ── Ad banner ─────────────────────────────────────────────────────
const AD_IMAGE_URL = 'https://wgkxsvgutyzcsfsexgpn.supabase.co/storage/v1/object/public/images/banner.png' // ← pega aquí la URL de tu imagen en Supabase Storage

function AdBanner() {
  if (!AD_IMAGE_URL) return null
  return (
    <div className="px-5 mb-5">
      <img
        src={AD_IMAGE_URL}
        alt="Publicidad"
        className="w-full rounded-2xl object-cover"
        style={{ maxHeight: 120 }}
      />
    </div>
  )
}

// ── Featured hero card ─────────────────────────────────────────────
function FeaturedCard({ match, reminderActive, onToggle, onClick }: {
  match: Match; reminderActive: boolean; onToggle: () => void; onClick: () => void
}) {
  const color = competitionColors[match.competition] ?? '#003DA5'
  const dateBadge = match.match_date === 'HOY' ? 'HOY' : match.match_date === 'MAÑANA' ? 'MAÑANA' : match.match_date

  return (
    <div
      onClick={onClick}
      className="rounded-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-transform relative"
      style={{ background: `linear-gradient(135deg, ${color}cc 0%, ${color}66 100%)` }}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CompetitionLogo name={match.competition} size={16} />
            <span className="text-white/80 text-xs font-medium">{match.competition}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {dateBadge}
            </span>
            <button
              onClick={e => { e.stopPropagation(); onToggle() }}
              className="p-1.5 rounded-full bg-white/10"
            >
              <Bell
                size={16}
                strokeWidth={2}
                className={reminderActive ? 'text-white fill-white' : 'text-white/60'}
              />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center gap-2 flex-1">
            <TeamLogo name={match.home_team} logoUrl={match.home_team_logo} size="lg" className="drop-shadow-lg" />
            <span className="text-white text-xs font-bold text-center leading-tight max-w-[80px]">
              {match.home_team}
            </span>
          </div>

          <div className="flex flex-col items-center px-2">
            <span className="text-white text-3xl font-black tracking-tight drop-shadow">
              {match.match_time}
            </span>
            <span className="text-white/60 text-[10px] font-bold mt-1">VS</span>
          </div>

          <div className="flex flex-col items-center gap-2 flex-1">
            <TeamLogo name={match.away_team} logoUrl={match.away_team_logo} size="lg" className="drop-shadow-lg" />
            <span className="text-white text-xs font-bold text-center leading-tight max-w-[80px]">
              {match.away_team}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Mini card (horizontal scroll) ─────────────────────────────────
function MiniMatchCard({ match, reminderActive, onToggle, onClick }: {
  match: Match; reminderActive: boolean; onToggle: () => void; onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className="shrink-0 w-44 bg-brand-card border border-brand-border rounded-2xl p-3 flex flex-col gap-2 cursor-pointer active:scale-[0.97] transition-transform"
    >
      <div className="flex items-center justify-between">
        <CompetitionLogo name={match.competition} size={14} />
        <button onClick={e => { e.stopPropagation(); onToggle() }} className="p-0.5">
          <Bell
            size={13}
            strokeWidth={2}
            className={reminderActive ? 'text-brand-blue' : 'text-brand-muted'}
          />
        </button>
      </div>
      <div className="flex items-center justify-between gap-1">
        <TeamLogo name={match.home_team} size="xs" />
        <span className="text-brand-text text-sm font-black">{match.match_time}</span>
        <TeamLogo name={match.away_team} size="xs" />
      </div>
      <p className="text-brand-muted text-[10px] truncate">
        {match.home_team} vs {match.away_team}
      </p>
    </div>
  )
}

// ── Compact row ────────────────────────────────────────────────────
function CompactMatchRow({ match, reminderActive, onToggle, onClick }: {
  match: Match; reminderActive: boolean; onToggle: () => void; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-brand-card border border-brand-border rounded-xl px-4 py-3 flex items-center gap-3 active:scale-[0.98] transition-transform text-left"
    >
      <CompetitionLogo name={match.competition} size={18} className="shrink-0" />
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <TeamLogo name={match.home_team} size="xs" />
        <span className="text-brand-text text-xs font-bold shrink-0">{match.match_time}</span>
        <TeamLogo name={match.away_team} size="xs" />
        <span className="text-brand-muted text-xs truncate">
          {match.home_team} vs {match.away_team}
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-[10px] font-bold ${match.match_date === 'HOY' ? 'text-brand-blue' : 'text-brand-muted'}`}>
          {match.match_date}
        </span>
        <button onClick={e => { e.stopPropagation(); onToggle() }}>
          <Bell size={14} strokeWidth={2} className={reminderActive ? 'text-brand-blue' : 'text-brand-muted'} />
        </button>
      </div>
    </button>
  )
}
