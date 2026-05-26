import { useState, useEffect, useMemo, useRef, lazy, Suspense } from 'react'
import { Search, Crosshair, List, Map, MapPin, Star, X } from 'lucide-react'
const LeafletMap = lazy(() => import('../components/LeafletMap'))
import VenueCard from '../components/VenueCard'
import { useApp } from '../lib/context'
import type { Venue } from '../types'

const FILTERS = ['Todos', 'Abiertos', 'LaLiga', 'Hypermotion', 'Premier', 'Champions', 'Europa', 'Bundesliga', 'Serie A', 'F1', 'MotoGP']

const COMPETITION_MAP: Record<string, string> = {
  'LaLiga':      'LaLiga',
  'Hypermotion': 'LaLiga Hypermotion',
  'Premier':     'Premier League',
  'Champions':   'Champions League',
  'Europa':      'Europa League',
  'Bundesliga':  'Bundesliga',
  'Serie A':     'Serie A',
  'F1':          'Formula 1',
  'MotoGP':      'MotoGP',
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function formatDistance(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`
}

interface Props {
  onVenueClick: (venue: Venue) => void
  matchFilter?: string | null
}

export default function MapScreen({ onVenueClick, matchFilter }: Props) {
  const { venues, venueMatches, matches } = useApp()
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [searchText, setSearchText] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Venues enriched with distance
  const enriched = useMemo(() => {
    return venues.map(v => ({
      ...v,
      distance: userLocation && v.latitude && v.longitude
        ? formatDistance(haversineKm(userLocation[0], userLocation[1], v.latitude, v.longitude))
        : v.distance,
    }))
  }, [venues, userLocation])

  // Apply filters
  const filtered = useMemo(() => {
    let list = enriched

    // Match filter: only venues showing this match
    if (matchFilter) {
      const venueIds = new Set(
        Object.entries(venueMatches)
          .filter(([, matchIds]) => matchIds.includes(matchFilter))
          .map(([venueId]) => venueId)
      )
      list = list.filter(v => venueIds.has(v.id))
    }

    if (activeFilter === 'Abiertos') list = list.filter(v => v.is_open)
    else if (COMPETITION_MAP[activeFilter]) {
      list = list.filter(v => v.competitions.includes(COMPETITION_MAP[activeFilter]))
    }

    if (searchText.trim()) {
      const q = searchText.toLowerCase()
      list = list.filter(v =>
        v.name.toLowerCase().includes(q) || v.address.toLowerCase().includes(q)
      )
    }

    // Sort by distance if available
    if (userLocation) {
      list = [...list].sort((a, b) => {
        const da = a.latitude && a.longitude
          ? haversineKm(userLocation[0], userLocation[1], a.latitude, a.longitude) : Infinity
        const db = b.latitude && b.longitude
          ? haversineKm(userLocation[0], userLocation[1], b.latitude, b.longitude) : Infinity
        return da - db
      })
    }

    return list
  }, [enriched, activeFilter, searchText, matchFilter, venueMatches, userLocation])

  // Select first venue when filter changes
  useEffect(() => {
    setSelectedVenue(filtered[0] ?? null)
  }, [activeFilter, matchFilter])

  // Auto-select first result if nothing selected
  useEffect(() => {
    if (!selectedVenue && filtered.length > 0) setSelectedVenue(filtered[0])
  }, [filtered, selectedVenue])

  // Focus search input when opened
  useEffect(() => {
    if (showSearch) searchInputRef.current?.focus()
  }, [showSearch])

  // Apply match filter label
  const matchFilterLabel = matchFilter
    ? matches.find(m => m.id === matchFilter)
    : null

  function requestLocation() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      pos => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => {},
      { timeout: 8000 }
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="pt-14 px-5 pb-3 bg-brand-bg z-10 relative">
        {showSearch ? (
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 flex items-center gap-2 bg-brand-card border border-brand-blue rounded-xl px-3 py-2.5">
              <Search size={15} className="text-brand-muted shrink-0" />
              <input
                ref={searchInputRef}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                placeholder="Buscar bar o dirección…"
                className="flex-1 bg-transparent text-sm text-brand-text outline-none placeholder-brand-muted"
              />
              {searchText && (
                <button onClick={() => setSearchText('')}>
                  <X size={14} className="text-brand-muted" />
                </button>
              )}
            </div>
            <button
              onClick={() => { setShowSearch(false); setSearchText('') }}
              className="text-sm text-brand-blue font-semibold"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-brand-text tracking-tight leading-6">Mapa de bares</h1>
              {matchFilterLabel && (
                <p className="text-xs text-brand-blue font-medium mt-0.5">
                  {matchFilterLabel.home_team} vs {matchFilterLabel.away_team}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-brand-card border border-brand-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('map')}
                  className={`w-9 h-9 flex items-center justify-center transition-colors ${viewMode === 'map' ? 'bg-brand-navy text-white' : 'text-brand-muted'}`}
                >
                  <Map size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`w-9 h-9 flex items-center justify-center transition-colors ${viewMode === 'list' ? 'bg-brand-navy text-white' : 'text-brand-muted'}`}
                >
                  <List size={16} />
                </button>
              </div>
              <button
                onClick={() => setShowSearch(true)}
                className="w-9 h-9 rounded-full bg-brand-card border border-brand-border flex items-center justify-center"
              >
                <Search size={17} className="text-brand-text" />
              </button>
            </div>
          </div>
        )}

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto chip-scroll pb-1 -mx-5 px-5">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                activeFilter === f
                  ? 'bg-brand-navy text-white'
                  : 'bg-brand-card border border-brand-border text-brand-muted'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {viewMode === 'map' ? (
        <div className="flex-1 relative overflow-hidden">
          <Suspense fallback={<div className="w-full h-full bg-[#0D1B2E]" />}>
            <LeafletMap
              venues={filtered}
              selectedVenue={selectedVenue}
              onSelectVenue={setSelectedVenue}
              userLocation={userLocation}
            />
          </Suspense>

          {/* Float: locate me */}
          <div className="absolute right-4 top-4 z-[1000]">
            <button
              onClick={requestLocation}
              className="w-10 h-10 bg-brand-card border border-brand-border rounded-xl flex items-center justify-center shadow-lg"
            >
              <Crosshair size={18} className="text-brand-blue" />
            </button>
          </div>

          {/* Bottom card */}
          {selectedVenue && (
            <div className="absolute bottom-[84px] left-0 right-0 px-4 z-[1000]">
              <VenueBottomCard venue={selectedVenue} onClick={() => onVenueClick(selectedVenue)} />
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-5 pb-28">
          <p className="text-xs font-bold text-brand-muted uppercase tracking-widest mt-4 mb-3">
            {filtered.length} {filtered.length === 1 ? 'local' : 'locales'}
            {searchText ? ` para "${searchText}"` : ''}
          </p>
          <div className="flex flex-col gap-3">
            {filtered.map(venue => (
              <VenueCard key={venue.id} venue={venue} onClick={() => onVenueClick(venue)} />
            ))}
            {filtered.length === 0 && (
              <div className="text-center text-brand-muted text-sm py-12">
                {searchText ? `Sin resultados para "${searchText}"` : 'No hay locales para este filtro'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function VenueBottomCard({ venue, onClick }: { venue: Venue; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-brand-card border border-brand-border rounded-2xl p-4 flex items-center gap-3 active:scale-[0.99] transition-transform shadow-2xl text-left"
    >
      <div className="w-14 h-14 rounded-xl bg-brand-accent flex items-center justify-center shrink-0 border border-brand-border">
        <span className="text-2xl">🍺</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-brand-text truncate">{venue.name}</p>
        <div className="flex items-center gap-1 my-0.5">
          <MapPin size={11} className="text-brand-muted" />
          <span className="text-xs text-brand-muted truncate">{venue.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-semibold ${venue.is_open ? 'text-brand-blue' : 'text-red-400'}`}>
            {venue.is_open ? `Abierto hasta ${venue.open_until}` : 'Cerrado'}
          </span>
          <span className="text-brand-border">·</span>
          <Star size={11} className="text-yellow-400 fill-yellow-400" />
          <span className="text-[10px] text-brand-muted">{venue.rating} ({venue.reviews_count})</span>
        </div>
        {venue.competitions.length > 0 && (
          <p className="text-[10px] text-brand-muted mt-0.5 truncate">
            {venue.competitions.join(' · ')}
          </p>
        )}
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        {venue.distance && <span className="text-xs text-brand-blue font-semibold">{venue.distance}</span>}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-muted">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </button>
  )
}
