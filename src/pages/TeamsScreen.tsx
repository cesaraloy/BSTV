import { useMemo, useState } from 'react'
import { ArrowLeft, Search, Check } from 'lucide-react'
import { useApp } from '../lib/context'
import TeamLogo, { CompetitionLogo } from '../components/TeamLogo'

const COMP_ORDER = [
  'LaLiga',
  'LaLiga Hypermotion',
  'Premier League',
  'Champions League',
  'Europa League',
  'Bundesliga',
  'Serie A',
  'Ligue 1',
  'Primeira Liga',
  "Women's Champions League",
  'MotoGP',
  'Formula 1',
]

const CHIP_LABELS: Record<string, string> = {
  'LaLiga':                   'LaLiga',
  'LaLiga Hypermotion':       'Hypermotion',
  'Premier League':           'Premier',
  'Champions League':         'Champions',
  'Europa League':            'Europa',
  'Bundesliga':               'Bundesliga',
  'Serie A':                  'Serie A',
  'Ligue 1':                  'Ligue 1',
  'Primeira Liga':            'Portugal',
  "Women's Champions League": "Women's",
  'MotoGP':                   'MotoGP',
  'Formula 1':                'F1',
}

interface Props {
  onBack: () => void
}

export default function TeamsScreen({ onBack }: Props) {
  const { teams, toggleTeam, saveTeams } = useApp()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Todos')
  const [saved, setSaved] = useState(false)

  const filtered = useMemo(() => teams.filter(t => {
    const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'Todos' || t.competition === filter
    return matchesSearch && matchesFilter
  }), [teams, search, filter])

  const grouped = useMemo(() =>
    COMP_ORDER
      .map(comp => ({ comp, items: filtered.filter(t => t.competition === comp) }))
      .filter(g => g.items.length > 0),
    [filtered]
  )

  const handleSave = () => {
    saveTeams(teams)
    setSaved(true)
    setTimeout(() => { setSaved(false); onBack() }, 1000)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="pt-14 px-5 pb-3 bg-brand-bg">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-brand-card border border-brand-border flex items-center justify-center shrink-0">
            <ArrowLeft size={18} className="text-brand-text" />
          </button>
          <h1 className="text-xl font-bold text-brand-text tracking-tight">Equipos que sigo</h1>
        </div>

        <div className="relative mb-3">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            placeholder="Buscar equipo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-brand-card border border-brand-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-brand-text placeholder-brand-muted outline-none focus:border-brand-blue transition-colors"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto chip-scroll pb-1 -mx-5 px-5">
          <button
            onClick={() => setFilter('Todos')}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              filter === 'Todos' ? 'bg-brand-navy text-white' : 'bg-brand-card border border-brand-border text-brand-muted'
            }`}
          >
            Todos
          </button>
          {COMP_ORDER.map(comp => (
            <button
              key={comp}
              onClick={() => setFilter(comp)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                filter === comp ? 'bg-brand-navy text-white' : 'bg-brand-card border border-brand-border text-brand-muted'
              }`}
            >
              <CompetitionLogo name={comp} size={12} />
              {CHIP_LABELS[comp]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28">
        {grouped.length === 0 && (
          <div className="text-center text-brand-muted text-sm py-12">No hay resultados</div>
        )}

        {grouped.map(({ comp, items }) => (
          <div key={comp} className="mt-4">
            {/* Competition header */}
            <div className="flex items-center gap-2 mb-2">
              <CompetitionLogo name={comp} size={16} />
              <span className="text-xs font-bold text-brand-muted uppercase tracking-widest">{comp}</span>
              <span className="text-[10px] text-brand-muted">· {items.filter(t => t.enabled).length}/{items.length}</span>
            </div>

            <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
              {items.map((team, i) => (
                <div key={team.id}>
                  <button
                    onClick={() => toggleTeam(team.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 active:bg-brand-border/30 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-sm flex items-center justify-center shrink-0">
                      <TeamLogo name={team.name} logoUrl={team.logo_url} size="md" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-semibold text-brand-text">{team.name}</p>
                      <p className="text-[11px] text-brand-muted">{team.country}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                      team.enabled ? 'bg-brand-navy border-brand-blue' : 'border-brand-border'
                    }`}>
                      {team.enabled && <Check size={13} strokeWidth={3} className="text-white" />}
                    </div>
                  </button>
                  {i < items.length - 1 && <div className="ml-16 border-b border-brand-border" />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-5 pb-6 pt-3 bg-gradient-to-t from-brand-bg via-brand-bg to-transparent z-30">
        <button
          onClick={handleSave}
          className={`w-full py-3.5 rounded-2xl font-bold text-sm text-white transition-all ${
            saved ? 'bg-brand-navy/80' : 'bg-brand-navy active:scale-[0.98]'
          }`}
        >
          {saved ? '✓ Guardado' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}
