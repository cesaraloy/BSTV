import { useState, useEffect } from 'react'
import { AppProvider } from './lib/context'
import { useApp } from './lib/context'
import { sendMagicLink, sendOTP, verifyOTP, verifyEmailOTP, signOut, getSession, onAuthStateChange } from './lib/auth'
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
  | { step: 'email-otp'; email: string }
  | { step: 'app' }

function AppInner() {
  const { user, setUser } = useApp()
  const [authStep, setAuthStep] = useState<AuthStep>(
    DEMO_MODE ? { step: 'app' } : { step: 'loading' }
  )
  const [screen, setScreen] = useState<Screen>({ type: 'tab', tab: 'home' })
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [mapMatchFilter, setMapMatchFilter] = useState<string | null>(null)
  const [visitedTabs, setVisitedTabs] = useState<Set<Tab>>(() => new Set<Tab>(['home']))

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
  const handleSendEmail = async (email: string) => {
    const result = await sendMagicLink(email)
    if (!result.error) setAuthStep({ step: 'email-otp', email })
    return result
  }

  const handleSendOTP = async (phone: string) => {
    const result = await sendOTP(phone)
    if (!result.error) setAuthStep({ step: 'otp', phone })
    return result
  }

  const handleVerifyOTP = async (code: string) => {
    if (authStep.step !== 'otp') return { error: 'Estado inválido' }
    const { user: authUser, error } = await verifyOTP(authStep.phone, code)
    if (authUser) { setUser(authUser); setAuthStep({ step: 'app' }) }
    return { error }
  }

  const handleVerifyEmailOTP = async (code: string) => {
    if (authStep.step !== 'email-otp') return { error: 'Estado inválido' }
    const { user: authUser, error } = await verifyEmailOTP(authStep.email, code)
    if (authUser) { setUser(authUser); setAuthStep({ step: 'app' }) }
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
        <img
          src="https://wgkxsvgutyzcsfsexgpn.supabase.co/storage/v1/object/public/images/app-512-bstv.png"
          alt="BSTV"
          className="w-16 h-16 rounded-2xl animate-pulse"
        />
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
          contact={authStep.phone}
          type="sms"
          onVerify={handleVerifyOTP}
          onBack={() => setAuthStep({ step: 'login' })}
          onResend={() => sendOTP(authStep.phone)}
        />
      </div>
    )
  }

  if (authStep.step === 'email-otp') {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-brand-bg">
        <OTPScreen
          contact={authStep.email}
          type="email"
          onVerify={handleVerifyEmailOTP}
          onBack={() => setAuthStep({ step: 'login' })}
          onResend={() => sendMagicLink(authStep.email)}
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
