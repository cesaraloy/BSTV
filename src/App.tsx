import { useState, useEffect } from 'react'
import { AppProvider } from './lib/context'
import { useApp } from './lib/context'
import { sendMagicLink, sendOTP, verifyOTP, signOut, getSession, onAuthStateChange } from './lib/auth'
import BottomNav from './components/BottomNav'
import HomeScreen from './pages/HomeScreen'
import CalendarScreen from './pages/CalendarScreen'
import MapScreen from './pages/MapScreen'
import ProfileScreen from './pages/ProfileScreen'
import TeamsScreen from './pages/TeamsScreen'
import MatchDetailScreen from './pages/MatchDetailScreen'
import VenueDetailScreen from './pages/VenueDetailScreen'
import LoginScreen from './pages/LoginScreen'
import OTPScreen from './pages/OTPScreen'
import type { Match, Venue } from './types'

const DEMO_MODE = !import.meta.env.VITE_SUPABASE_URL

type Tab = 'home' | 'calendar' | 'map' | 'profile'
type Screen =
  | { type: 'tab'; tab: Tab }
  | { type: 'match-detail'; match: Match }
  | { type: 'venue-detail'; venue: Venue; from?: Tab }
  | { type: 'teams' }

type AuthStep =
  | { step: 'loading' }
  | { step: 'login' }
  | { step: 'otp'; phone: string }
  | { step: 'app' }

function AppInner() {
  const { user, setUser } = useApp()
  const [authStep, setAuthStep] = useState<AuthStep>(
    DEMO_MODE ? { step: 'app' } : { step: 'loading' }
  )
  const [screen, setScreen] = useState<Screen>({ type: 'tab', tab: 'home' })
  const [activeTab, setActiveTab] = useState<Tab>('home')

  // Restore session on mount + listen for magic link redirect
  useEffect(() => {
    if (DEMO_MODE) return

    getSession().then(session => {
      if (session) {
        setUser(session)
        setAuthStep({ step: 'app' })
      } else {
        setAuthStep({ step: 'login' })
      }
    })

    const unsubscribe = onAuthStateChange(authUser => {
      if (authUser) {
        setUser(authUser)
        setAuthStep({ step: 'app' })
      } else {
        setUser(null)
        setAuthStep({ step: 'login' })
      }
    })

    return unsubscribe
  }, [])

  // ── Auth handlers ──────────────────────────────────────────────
  const handleSendEmail = async (email: string) => sendMagicLink(email)

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

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
    setAuthStep({ step: 'login' })
  }

  // ── Loading splash ─────────────────────────────────────────────
  if (authStep.step === 'loading') {
    return (
      <div className="relative w-full h-screen bg-brand-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-navy flex items-center justify-center animate-pulse">
            <span className="text-3xl">⚽</span>
          </div>
        </div>
      </div>
    )
  }

  // ── Auth screens ───────────────────────────────────────────────
  if (authStep.step === 'login') {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-brand-bg">
        <LoginScreen onSendEmail={handleSendEmail} onSendOTP={handleSendOTP} />
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
          onResend={() => sendOTP(authStep.phone)}
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
        {screen.type === 'tab' && screen.tab === 'home' && (
          <HomeScreen
            onMatchClick={match => navigate({ type: 'match-detail', match })}
            onVenueClick={venue => navigate({ type: 'venue-detail', venue, from: 'home' as Tab })}
            onAllMatchesClick={() => handleTabChange('calendar')}
            onMapClick={() => handleTabChange('map')}
          />
        )}
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
            userEmail={user?.email}
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
