import { supabase } from './supabase'

export interface AuthUser {
  id: string
  phone?: string
  email?: string
}

// URL base de la app (origin + path, sin query ni hash)
const APP_URL = import.meta.env.VITE_APP_URL
  ?? `${window.location.origin}${window.location.pathname.replace(/\/$/, '')}`

// ── Email magic link ───────────────────────────────────────────────
export async function sendMagicLink(email: string): Promise<{ error: string | null }> {
  if (!supabase) {
    console.log('[Demo] Magic link enviado a', email)
    return { error: null }
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: APP_URL,
    },
  })
  return { error: error?.message ?? null }
}

// ── SMS OTP ───────────────────────────────────────────────────────
export async function sendOTP(phone: string): Promise<{ error: string | null }> {
  if (!supabase) {
    console.log('[Demo] OTP enviado a', phone)
    return { error: null }
  }

  const { error } = await supabase.auth.signInWithOtp({ phone })
  return { error: error?.message ?? null }
}

export async function verifyOTP(
  phone: string,
  token: string,
): Promise<{ user: AuthUser | null; error: string | null }> {
  if (!supabase) {
    if (token.length === 6) return { user: { id: 'demo-user', phone }, error: null }
    return { user: null, error: 'Código incorrecto' }
  }

  const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' })
  if (error) return { user: null, error: error.message }
  if (!data.user) return { user: null, error: 'Error de verificación' }

  await upsertUser(data.user.id, { phone: data.user.phone ?? phone })
  return { user: { id: data.user.id, phone: data.user.phone ?? phone }, error: null }
}

// ── Session management ────────────────────────────────────────────
export async function getSession(): Promise<AuthUser | null> {
  if (!supabase) return null

  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null

  const user: AuthUser = {
    id: session.user.id,
    phone: session.user.phone ?? undefined,
    email: session.user.email ?? undefined,
  }
  console.log('[Auth] session restored, user id:', user.id)
  // Ensure public.users record exists on every session restore
  const { error } = await upsertUser(user.id, { phone: user.phone, email: user.email })
  if (error) console.error('[Auth] upsertUser failed:', error)
  return user
}

// Listen to auth state changes (email magic link redirect, etc.)
export function onAuthStateChange(
  callback: (user: AuthUser | null) => void,
) {
  if (!supabase) return () => {}

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (session?.user) {
        const user: AuthUser = {
          id: session.user.id,
          phone: session.user.phone ?? undefined,
          email: session.user.email ?? undefined,
        }
        // Upsert on first sign-in
        if (event === 'SIGNED_IN') {
          await upsertUser(user.id, { phone: user.phone, email: user.email })
        }
        callback(user)
      } else {
        callback(null)
      }
    }
  )

  return () => subscription.unsubscribe()
}

export async function signOut(): Promise<void> {
  if (!supabase) return
  await supabase.auth.signOut()
}

// ── Helpers ───────────────────────────────────────────────────────
async function upsertUser(
  id: string,
  fields: { phone?: string; email?: string },
): Promise<{ error: unknown }> {
  if (!supabase) return { error: null }
  const { error } = await supabase.from('users').upsert(
    { id, name: 'Usuario', ...fields },
    { onConflict: 'id' },
  )
  if (error) console.error('[Auth] upsertUser error:', error.code, error.message)
  return { error }
}
