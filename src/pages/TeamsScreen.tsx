import { useState } from 'react'
import { ArrowLeft, Search, Check } from 'lucide-react'
import { useApp } from '../lib/context'
import TeamLogo from '../components/TeamLogo'

const COMPETITION_FILTERS = ['Todos', 'LaLiga', 'Hypermotion', 'Champions', 'Europa', "Women's CL", 'MotoGP', 'F1']

interface Props {
  onBack: () => void
}

const competitionKey: Record<string, string> = {
  'LaLiga': 'LaLiga',
  'Hypermotion': 'LaLiga Hypermotion',
  'Champions': 'Champions League',
  'Europa': 'Europa League',
  "Women's CL": "Women's Champions League",
  'MotoGP': 'MotoGP',
  'F1': 'Formula 1',
}

export default function TeamsScreen({ onBack }: Props) {
  const { teams, toggleTeam, saveTeams } = useApp()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Todos')
  const [saved, setSaved] = useState(false)

  const filtered = teams.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter =
      filter === 'Todos' || t.competition === (competitionKey[filter] ?? filter)
    return matchesSearch && matchesFilter
  })

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
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-brand-card border border-brand-border flex items-center justify-center">
            <ArrowLeft size={18} className="text-brand-text" />
          </button>
          <h1 className="text-xl font-bold text-brand-text tracking-tight">Equipos que sigo</h1>
        </div>

        <div className="relative mb-3">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            placeholder="Buscar equipo o piloto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-brand-card border border-brand-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-brand-text placeholder-brand-muted outline-none focus:border-brand-blue transition-colors"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto chip-scroll pb-1 -mx-5 px-5">
          {COMPETITION_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                filter === f
                  ? 'bg-brand-navy text-white'
                  : 'bg-brand-card border border-brand-border text-brand-muted'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-28">
        <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden mt-2">
          {filtered.map((team, i) => (
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
                  <p className="text-[11px] text-brand-muted">{team.competition} · {team.country}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  team.enabled ? 'bg-brand-navy border-brand-blue' : 'border-brand-border'
                }`}>
                  {team.enabled && <Check size={13} strokeWidth={3} className="text-white" />}
                </div>
              </button>
              {i < filtered.length - 1 && <div className="ml-16 border-b border-brand-border" />}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-brand-muted text-sm py-10">
              No hay resultados
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-20 left-0 right-0 px-5 z-30">
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
