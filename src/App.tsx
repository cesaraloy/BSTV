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
import FAQScreen from './pages/FAQScreen'
import AvatarPickerScreen from './pages/AvatarPickerScreen'
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
  | { type: 'faq' }
  | { type: 'avatar-picker' }

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
  const [mapMatchFilter, setMapMatchFilter] = useState<string | null>(null)
  // Lazy-mount tabs: only render once first visited (avoids Leaflet init inside display:none)
  const [visitedTabs, setVisitedTabs] = useState<Set<Tab>>(() => new Set<Tab>(['home']))

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
    else if (screen.type === 'faq') setScreen({ type: 'tab', tab: 'profile' })
    else if (screen.type === 'avatar-picker') setScreen({ type: 'tab', tab: 'profile' })
  }

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    setScreen({ type: 'tab', tab })
    setVisitedTabs(prev => { const n = new Set(prev); n.add(tab); return n })
    if (tab !== 'map') setMapMatchFilter(null)
  }

  const handleShowOnMap = (matchId: string) => {
    setMapMatchFilter(matchId)
    setActiveTab('map')
    setScreen({ type: 'tab', tab: 'map' })
  }

  const showNav = screen.type === 'tab'

  const isTab = screen.type === 'tab'

  return (
    <div className="relative w-full h-screen overflow-hidden bg-brand-bg flex flex-col">
      <div className="flex-1 overflow-hidden relative">
        {/* Tab screens: lazy-mounted on first visit, kept alive with absolute overlay */}
        {visitedTabs.has('home') && (
          <div className={`absolute inset-0 ${isTab && screen.tab === 'home' ? '' : 'hidden'}`}>
            <HomeScreen
              onMatchClick={match => navigate({ type: 'match-detail', match })}
              onVenueClick={venue => navigate({ type: 'venue-detail', venue, from: 'home' as Tab })}
              onAllMatchesClick={() => handleTabChange('calendar')}
              onMapClick={() => handleTabChange('map')}
            />
          </div>
        )}
        {visitedTabs.has('calendar') && (
          <div className={`absolute inset-0 ${isTab && screen.tab === 'calendar' ? '' : 'hidden'}`}>
            <CalendarScreen onMatchClick={match => navigate({ type: 'match-detail', match })} />
          </div>
        )}
        {visitedTabs.has('map') && (
          <div className={`absolute inset-0 ${isTab && screen.tab === 'map' ? '' : 'hidden'}`}>
            <MapScreen
              onVenueClick={venue => navigate({ type: 'venue-detail', venue, from: 'map' })}
              matchFilter={mapMatchFilter}
            />
          </div>
        )}
        {visitedTabs.has('profile') && (
          <div className={`absolute inset-0 ${isTab && screen.tab === 'profile' ? '' : 'hidden'}`}>
            <ProfileScreen
              onTeamsClick={() => navigate({ type: 'teams' })}
              onFAQClick={() => navigate({ type: 'faq' })}
              onAvatarClick={() => navigate({ type: 'avatar-picker' })}
              onSignOut={handleSignOut}
              userPhone={user?.phone}
              userEmail={user?.email}
            />
          </div>
        )}

        {/* Stack screens: mounted on demand */}
        {screen.type === 'match-detail' && (
          <MatchDetailScreen
            match={screen.match}
            onBack={goBack}
            onVenueClick={venue => navigate({ type: 'venue-detail', venue, from: activeTab })}
            onMapClick={handleShowOnMap}
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
        {screen.type === 'faq' && <FAQScreen onBack={goBack} />}
        {screen.type === 'avatar-picker' && <AvatarPickerScreen onBack={goBack} />}
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
