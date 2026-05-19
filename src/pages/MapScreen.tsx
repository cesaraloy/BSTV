import { useState } from 'react'
import { Search, Crosshair, SlidersHorizontal, MapPin, Star } from 'lucide-react'
import { useApp } from '../lib/context'
import type { Venue } from '../types'

const FILTERS = ['Todos', 'Abiertos', 'Champions', 'LaLiga', 'Premier']

// Demo venue positions on the SVG map (relative x/y percentages)
const venuePositions: Record<string, { x: number; y: number }> = {
  '1': { x: 52, y: 55 },
  '2': { x: 42, y: 38 },
  '3': { x: 65, y: 45 },
  '4': { x: 48, y: 25 },
  '5': { x: 50, y: 60 },
}

interface Props {
  onVenueClick: (venue: Venue) => void
}

export default function MapScreen({ onVenueClick }: Props) {
  const { venues } = useApp()
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [selectedVenue, setSelectedVenue] = useState<Venue>(venues[0])

  const filtered = venues.filter(v => {
    if (activeFilter === 'Todos') return true
    if (activeFilter === 'Abiertos') return v.is_open
    if (activeFilter === 'Champions') return v.competitions.includes('Champions League')
    if (activeFilter === 'LaLiga') return v.competitions.includes('LaLiga')
    if (activeFilter === 'Premier') return v.competitions.includes('Premier League')
    return true
  })

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="pt-14 px-5 pb-3 bg-brand-bg z-10 relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚽</span>
            <h1 className="text-2xl font-bold text-white tracking-tight">Bares de Fútbol</h1>
          </div>
          <button className="w-9 h-9 rounded-full bg-brand-card border border-brand-border flex items-center justify-center">
            <Search size={17} className="text-brand-text" />
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto chip-scroll pb-1 -mx-5 px-5">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                activeFilter === f
                  ? 'bg-brand-green text-brand-bg'
                  : 'bg-brand-card border border-brand-border text-brand-muted'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Map area */}
      <div className="flex-1 relative overflow-hidden">
        <DemoMap venues={filtered} selectedVenue={selectedVenue} onSelectVenue={setSelectedVenue} />

        {/* Float controls */}
        <div className="absolute right-4 top-4 flex flex-col gap-2 z-20">
          <button className="w-10 h-10 bg-brand-card border border-brand-border rounded-xl flex items-center justify-center shadow-lg">
            <Crosshair size={18} className="text-brand-green" />
          </button>
          <button className="w-10 h-10 bg-brand-card border border-brand-border rounded-xl flex items-center justify-center shadow-lg">
            <SlidersHorizontal size={18} className="text-brand-text" />
          </button>
        </div>

        {/* Bottom card */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 z-20">
          <div
            onClick={() => onVenueClick(selectedVenue)}
            className="bg-brand-card border border-brand-border rounded-2xl p-4 flex items-center gap-3 cursor-pointer active:scale-[0.99] transition-transform shadow-2xl"
          >
            <div className="w-14 h-14 rounded-xl bg-brand-accent flex items-center justify-center shrink-0">
              <span className="text-2xl">🍺</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{selectedVenue.name}</p>
              <div className="flex items-center gap-1 my-0.5">
                <MapPin size={11} className="text-brand-muted" />
                <span className="text-xs text-brand-muted truncate">{selectedVenue.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-semibold ${selectedVenue.is_open ? 'text-brand-green' : 'text-red-400'}`}>
                  {selectedVenue.is_open ? `Abierto hasta ${selectedVenue.open_until}` : 'Cerrado'}
                </span>
                <span className="text-brand-border">·</span>
                <Star size={11} className="text-yellow-400 fill-yellow-400" />
                <span className="text-[10px] text-brand-muted">{selectedVenue.rating} ({selectedVenue.reviews_count})</span>
              </div>
              <p className="text-[10px] text-brand-muted mt-0.5 truncate">
                {selectedVenue.competitions.join(' · ')}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-xs text-brand-green font-semibold">{selectedVenue.distance}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-muted">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DemoMap({ venues, selectedVenue, onSelectVenue }: {
  venues: Venue[]
  selectedVenue: Venue
  onSelectVenue: (v: Venue) => void
}) {
  return (
    <div className="w-full h-full relative bg-[#0D1B2E] overflow-hidden">
      {/* Grid lines simulating map */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E3A5F" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Street lines */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#1A2E4A" strokeWidth="8" />
        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#1A2E4A" strokeWidth="8" />
        <line x1="0" y1="35%" x2="100%" y2="35%" stroke="#152338" strokeWidth="5" />
        <line x1="0" y1="65%" x2="100%" y2="72%" stroke="#152338" strokeWidth="5" />
        <line x1="30%" y1="0" x2="35%" y2="100%" stroke="#152338" strokeWidth="5" />
        <line x1="70%" y1="0" x2="68%" y2="100%" stroke="#152338" strokeWidth="5" />
        <line x1="0" y1="20%" x2="100%" y2="22%" stroke="#111D2E" strokeWidth="3" />
        <line x1="20%" y1="0" x2="18%" y2="100%" stroke="#111D2E" strokeWidth="3" />
        <line x1="80%" y1="0" x2="82%" y2="100%" stroke="#111D2E" strokeWidth="3" />
        {/* Blocks */}
        <rect x="36%" y="37%" width="13%" height="12%" rx="2" fill="#0F1A2B" />
        <rect x="52%" y="37%" width="15%" height="12%" rx="2" fill="#0F1A2B" />
        <rect x="36%" y="51%" width="13%" height="13%" rx="2" fill="#0F1A2B" />
        <rect x="52%" y="51%" width="15%" height="13%" rx="2" fill="#0F1A2B" />
      </svg>

      {/* User location */}
      <div
        className="absolute z-10"
        style={{ left: '50%', top: '57%', transform: 'translate(-50%,-50%)' }}
      >
        <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg">
          <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-40" />
        </div>
      </div>

      {/* Venue pins */}
      {venues.map(v => {
        const pos = venuePositions[v.id]
        if (!pos) return null
        const isSelected = v.id === selectedVenue.id
        return (
          <button
            key={v.id}
            onClick={() => onSelectVenue(v)}
            className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <div className={`flex flex-col items-center gap-0.5 transition-transform ${isSelected ? 'scale-125' : 'scale-100'}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg border-2 transition-colors ${
                isSelected
                  ? 'bg-brand-green border-brand-green'
                  : v.is_open
                    ? 'bg-brand-card border-brand-border'
                    : 'bg-brand-surface border-brand-border opacity-60'
              }`}>
                <span className="text-base">⚽</span>
              </div>
              {isSelected && (
                <div className="bg-brand-green text-brand-bg text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap max-w-[70px] truncate">
                  {v.name.split(' ').slice(0, 2).join(' ')}
                </div>
              )}
            </div>
          </button>
        )
      })}

      {/* "MADRID" label */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full opacity-10 pointer-events-none">
        <span className="text-5xl font-black text-white tracking-widest">MADRID</span>
      </div>
    </div>
  )
}
