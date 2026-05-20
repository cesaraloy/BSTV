import { useState } from 'react'
import { AppProvider } from './lib/context'
import { useApp } from './lib/context'
import { sendOTP, verifyOTP, signOut } from './lib/auth'
import BottomNav from './components/BottomNav'
import CalendarScreen from './pages/CalendarScreen'
import MapScreen from './pages/MapScreen'
import ProfileScreen from './pages/ProfileScreen'
import TeamsScreen from './pages/TeamsScreen'
import MatchDetailScreen from './pages/MatchDetailScreen'
import VenueDetailScreen from './pages/VenueDetailScreen'
import LoginScreen from './pages/LoginScreen'
import OTPScreen from './pages/OTPScreen'
import type { Match, Venue } from './types'

type Tab = 'calendar' | 'map' | 'profile'
type Screen =
  | { type: 'tab'; tab: Tab }
  | { type: 'match-detail'; match: Match }
  | { type: 'venue-detail'; venue: Venue; from?: Tab }
  | { type: 'teams' }

// Auth flow state separate from app screen state
type AuthStep =
  | { step: 'login' }
  | { step: 'otp'; phone: string }
  | { step: 'app' }

function AppInner() {
  const { user, setUser } = useApp()
  const [authStep, setAuthStep] = useState<AuthStep>(
    // Skip login in demo mode (no Supabase configured)
    import.meta.env.VITE_SUPABASE_URL ? { step: 'login' } : { step: 'app' }
  )
  const [screen, setScreen] = useState<Screen>({ type: 'tab', tab: 'calendar' })
  const [activeTab, setActiveTab] = useState<Tab>('calendar')

  // ── Auth handlers ──────────────────────────────────────────────
  const handleSendOTP = async (phone: string) => {
    const result = await sendOTP(phone)
    if (!result.error) setAuthStep({ step: 'otp', phone })
    return result
  }

  const handleVerifyOTP = async (code: string) => {
    if (authStep.step !== 'otp') return { error: 'Estado inválido' }
    const { user: authUser, error } = await verifyOTP(authStep.phone, code)
    if (authUser) {
      setUser(authUser)
      setAuthStep({ step: 'app' })
    }
    return { error }
  }

  const handleResend = async () => {
    if (authStep.step !== 'otp') return { error: null }
    return sendOTP(authStep.phone)
  }

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
    setAuthStep({ step: 'login' })
  }

  // ── Auth screens ───────────────────────────────────────────────
  if (authStep.step === 'login') {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-brand-bg">
        <LoginScreen onSendOTP={handleSendOTP} />
      </div>
    )
  }

  if (authStep.step === 'otp') {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-brand-bg">
        <OTPScreen
          phone={authStep.phone}
          onVerify={handleVerifyOTP}
          onBack={() => setAuthStep({ step: 'login' })}
          onResend={handleResend}
        />
      </div>
    )
  }

  // ── App screens ────────────────────────────────────────────────
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
          <CalendarScreen onMatchClick={match => navigate({ type: 'match-detail', match })} />
        )}
        {screen.type === 'tab' && screen.tab === 'map' && (
          <MapScreen onVenueClick={venue => navigate({ type: 'venue-detail', venue, from: 'map' })} />
        )}
        {screen.type === 'tab' && screen.tab === 'profile' && (
          <ProfileScreen
            onTeamsClick={() => navigate({ type: 'teams' })}
            onSignOut={handleSignOut}
            userPhone={user?.phone}
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
        {screen.type === 'teams' && <TeamsScreen onBack={goBack} />}
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
