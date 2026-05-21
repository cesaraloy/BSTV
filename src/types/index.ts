export interface Match {
  id: string
  home_team: string
  away_team: string
  competition: string
  match_date: string // 'HOY' | 'MAÑANA' | 'DD/MM'
  match_time: string
  match_datetime?: string | null // UTC ISO timestamp for push scheduling
  home_team_logo: string
  away_team_logo: string
  competition_logo: string
  venue_city: string
  is_featured: boolean
}

export interface Venue {
  id: string
  name: string
  address: string
  city: string
  latitude: number
  longitude: number
  phone: string
  image_url: string
  rating: number
  reviews_count: number
  is_open: boolean
  open_until: string
  competitions: string[]
  verified: boolean
  distance?: string
}

export interface Team {
  id: string
  name: string
  competition: string
  logo_url: string
  country: string
  enabled: boolean
}

export interface VenueMatch {
  id: string
  venue_id: string
  match_id: string
  confirmed: boolean
  source: string
}

export interface Reminder {
  id: string
  user_id: string
  match_id: string
  enabled: boolean
  reminder_time: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar_url: string
  default_location: string
}
