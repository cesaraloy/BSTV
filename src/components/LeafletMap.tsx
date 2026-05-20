import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Venue } from '../types'

interface Props {
  venues: Venue[]
  selectedVenue: Venue | null
  onSelectVenue: (v: Venue) => void
  userLocation: [number, number] | null
}

const MADRID: [number, number] = [40.4168, -3.7038]
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const TILE_ATTR = '&copy; <a href="https://openstreetmap.org">OSM</a> &copy; <a href="https://carto.com">CARTO</a>'

function pinHtml(isSelected: boolean, isOpen: boolean) {
  return `<div class="venue-pin${isSelected ? ' selected' : ''}${!isOpen ? ' closed' : ''}">⚽</div>`
}

export default function LeafletMap({ venues, selectedVenue, onSelectVenue, userLocation }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())
  const userMarkerRef = useRef<L.Marker | null>(null)

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: MADRID,
      zoom: 14,
      zoomControl: false,
      attributionControl: true,
    })

    L.tileLayer(TILE_URL, { attribution: TILE_ATTR, maxZoom: 19 }).addTo(map)
    L.control.zoom({ position: 'bottomright' }).addTo(map)

    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
      markersRef.current.clear()
    }
  }, [])

  // Sync venue markers
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const incoming = new Set(venues.map(v => v.id))

    // Remove stale markers
    markersRef.current.forEach((marker, id) => {
      if (!incoming.has(id)) { marker.remove(); markersRef.current.delete(id) }
    })

    // Add / update markers
    venues.forEach(venue => {
      if (!venue.latitude || !venue.longitude) return
      const isSelected = selectedVenue?.id === venue.id
      const html = pinHtml(isSelected, venue.is_open)
      const icon = L.divIcon({ html, className: '', iconSize: [36, 36], iconAnchor: [18, 18] })

      const existing = markersRef.current.get(venue.id)
      if (existing) {
        existing.setIcon(icon)
      } else {
        const marker = L.marker([venue.latitude, venue.longitude], { icon })
          .addTo(map)
          .on('click', () => onSelectVenue(venue))
        markersRef.current.set(venue.id, marker)
      }
    })
  }, [venues, selectedVenue, onSelectVenue])

  // Pan to selected venue
  useEffect(() => {
    if (!selectedVenue?.latitude || !selectedVenue?.longitude || !mapRef.current) return
    mapRef.current.panTo([selectedVenue.latitude, selectedVenue.longitude], { animate: true, duration: 0.4 })
  }, [selectedVenue])

  // User location marker
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    userMarkerRef.current?.remove()
    if (!userLocation) return

    const icon = L.divIcon({ html: '<div class="user-dot"></div>', className: '', iconSize: [14, 14], iconAnchor: [7, 7] })
    userMarkerRef.current = L.marker(userLocation, { icon, zIndexOffset: 1000 }).addTo(map)
    map.setView(userLocation, 14, { animate: true })
  }, [userLocation])

  return <div ref={containerRef} className="w-full h-full" />
}
