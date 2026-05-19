import { useState } from 'react'
import { ArrowLeft, Search, Check } from 'lucide-react'
import { useApp } from '../lib/context'

const COMPETITION_FILTERS = ['Todos', 'LaLiga', 'Premier League', 'Champions', 'Serie A', 'Bundesliga']

interface Props {
  onBack: () => void
}

const countryFlag: Record<string, string> = {
  España: '🇪🇸',
  Inglaterra: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  Italia: '🇮🇹',
  Alemania: '🇩🇪',
  Francia: '🇫🇷',
}

export default function TeamsScreen({ onBack }: Props) {
  const { teams, toggleTeam } = useApp()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Todos')
  const [saved, setSaved] = useState(false)

  const filtered = teams.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter =
      filter === 'Todos' ||
      (filter === 'Champions' ? t.competition.includes('Champions') : t.competition === filter)
    return matchesSearch && matchesFilter
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => { setSaved(false); onBack() }, 1000)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="pt-14 px-5 pb-3 bg-brand-bg">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-brand-card border border-brand-border flex items-center justify-center">
            <ArrowLeft size={18} className="text-brand-text" />
          </button>
          <h1 className="text-xl font-bold text-white tracking-tight">Equipos que estoy siguiendo</h1>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            placeholder="Buscar equipo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-brand-card border border-brand-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-brand-text placeholder-brand-muted outline-none focus:border-brand-green transition-colors"
          />
        </div>

        {/* Competition filters */}
        <div className="flex gap-2 overflow-x-auto chip-scroll pb-1 -mx-5 px-5">
          {COMPETITION_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                filter === f
                  ? 'bg-brand-green text-brand-bg'
                  : 'bg-brand-card border border-brand-border text-brand-muted'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Team list */}
      <div className="flex-1 overflow-y-auto px-5 pb-28">
        <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden mt-2">
          {filtered.map((team, i) => (
            <div key={team.id}>
              <button
                onClick={() => toggleTeam(team.id)}
                className="w-full flex items-center gap-3 px-4 py-3 active:bg-brand-border/30 transition-colors"
              >
                {/* Team logo placeholder */}
                <div className="w-9 h-9 rounded-full bg-brand-accent flex items-center justify-center shrink-0">
                  <span className="text-base">{countryFlag[team.country] ?? '⚽'}</span>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-semibold text-white">{team.name}</p>
                  <p className="text-[11px] text-brand-muted">{team.competition} · {team.country}</p>
                </div>
                {/* Toggle */}
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  team.enabled ? 'bg-brand-green border-brand-green' : 'border-brand-border'
                }`}>
                  {team.enabled && <Check size={13} strokeWidth={3} className="text-brand-bg" />}
                </div>
              </button>
              {i < filtered.length - 1 && <div className="ml-16 border-b border-brand-border" />}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-brand-muted text-sm py-10">
              No hay equipos para este filtro
            </div>
          )}
        </div>
      </div>

      {/* Save button */}
      <div className="absolute bottom-20 left-0 right-0 px-5 z-30">
        <button
          onClick={handleSave}
          className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all ${
            saved
              ? 'bg-brand-green/80 text-brand-bg'
              : 'bg-brand-green text-brand-bg active:scale-[0.98]'
          }`}
        >
          {saved ? '✓ Guardado' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}
