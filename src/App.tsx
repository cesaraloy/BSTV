import { useState } from 'react'
import { AppProvider } from './lib/context'
import BottomNav from './components/BottomNav'
import CalendarScreen from './pages/CalendarScreen'
import MapScreen from './pages/MapScreen'
import ProfileScreen from './pages/ProfileScreen'
import TeamsScreen from './pages/TeamsScreen'
import MatchDetailScreen from './pages/MatchDetailScreen'
import VenueDetailScreen from './pages/VenueDetailScreen'
import type { Match, Venue } from './types'

type Tab = 'calendar' | 'map' | 'profile'
type Screen =
  | { type: 'tab'; tab: Tab }
  | { type: 'match-detail'; match: Match }
  | { type: 'venue-detail'; venue: Venue; from?: Tab }
  | { type: 'teams' }

function AppInner() {
  const [screen, setScreen] = useState<Screen>({ type: 'tab', tab: 'calendar' })
  const [activeTab, setActiveTab] = useState<Tab>('calendar')

  const navigate = (s: Screen) => setScreen(s)

  const goBack = () => {
    if (screen.type === 'tab') return
    if (screen.type === 'match-detail') setScreen({ type: 'tab', tab: activeTab })
    else if (screen.type === 'venue-detail') setScreen({ type: 'tab', tab: screen.from ?? activeTab })
    else if (screen.type === 'teams') setScreen({ type: 'tab', tab: 'profile' })
  }

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    setScreen({ type: 'tab', tab })
  }

  const showNav = screen.type === 'tab'

  return (
    <div className="relative w-full h-screen overflow-hidden bg-brand-bg flex flex-col">
      <div className="flex-1 overflow-hidden relative">
        {screen.type === 'tab' && screen.tab === 'calendar' && (
          <CalendarScreen
            onMatchClick={match => navigate({ type: 'match-detail', match })}
          />
        )}
        {screen.type === 'tab' && screen.tab === 'map' && (
          <MapScreen
            onVenueClick={venue => navigate({ type: 'venue-detail', venue, from: 'map' })}
          />
        )}
        {screen.type === 'tab' && screen.tab === 'profile' && (
          <ProfileScreen
            onTeamsClick={() => navigate({ type: 'teams' })}
          />
        )}
        {screen.type === 'match-detail' && (
          <MatchDetailScreen
            match={screen.match}
            onBack={goBack}
            onVenueClick={venue => navigate({ type: 'venue-detail', venue, from: activeTab })}
          />
        )}
        {screen.type === 'venue-detail' && (
          <VenueDetailScreen
            venue={screen.venue}
            onBack={goBack}
            onMatchClick={match => navigate({ type: 'match-detail', match })}
          />
        )}
        {screen.type === 'teams' && (
          <TeamsScreen onBack={goBack} />
        )}
      </div>
      {showNav && <BottomNav active={activeTab} onChange={handleTabChange} />}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
