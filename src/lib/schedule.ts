export type TimeSlot = { open: string; close: string }
export type Schedule = Record<string, TimeSlot[] | null>

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
export const DAY_LABELS: Record<string, string> = {
  mon: 'Lunes', tue: 'Martes', wed: 'Miércoles', thu: 'Jueves',
  fri: 'Viernes', sat: 'Sábado', sun: 'Domingo',
}
export const DISPLAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function getVenueStatus(schedule?: Schedule | null): {
  is_open: boolean
  open_until: string | null
  opens_at: string | null  // next opening time today, if closed
} {
  if (!schedule) return { is_open: false, open_until: null, opens_at: null }

  const now = new Date()
  const dayKey = DAY_KEYS[now.getDay()]
  const slots = schedule[dayKey]
  if (!slots || slots.length === 0) return { is_open: false, open_until: null, opens_at: null }

  const current = now.getHours() * 60 + now.getMinutes()

  for (const slot of slots) {
    const openMin  = toMinutes(slot.open)
    const closeMin = toMinutes(slot.close) + (toMinutes(slot.close) < toMinutes(slot.open) ? 24 * 60 : 0)
    if (current >= openMin && current < closeMin) {
      return { is_open: true, open_until: slot.close, opens_at: null }
    }
  }

  // Closed now — find next opening slot today
  const next = slots.find(s => toMinutes(s.open) > current)
  return { is_open: false, open_until: null, opens_at: next?.open ?? null }
}

export function formatSlots(slots: TimeSlot[] | null | undefined): string {
  if (!slots || slots.length === 0) return 'Cerrado'
  return slots.map(s => `${s.open} – ${s.close}`).join('  ·  ')
}
