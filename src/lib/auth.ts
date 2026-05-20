import { supabase } from './supabase'

export interface AuthUser {
  id: string
  phone: string
}

// Send OTP to phone number
export async function sendOTP(phone: string): Promise<{ error: string | null }> {
  // Demo mode — no Supabase configured
  if (!supabase) {
    console.log('[Demo] OTP enviado a', phone)
    return { error: null }
  }

  const { error } = await supabase.auth.signInWithOtp({ phone })
  if (error) return { error: error.message }
  return { error: null }
}

// Verify OTP code
export async function verifyOTP(
  phone: string,
  token: string
): Promise<{ user: AuthUser | null; error: string | null }> {
  // Demo mode — accept any 6-digit code
  if (!supabase) {
    if (token === '000000' || token.length === 6) {
      return { user: { id: 'demo-user', phone }, error: null }
    }
    return { user: null, error: 'Código incorrecto' }
  }

  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  })

  if (error) return { user: null, error: error.message }
  if (!data.user) return { user: null, error: 'Error de verificación' }

  // Upsert user row in public.users
  await supabase.from('users').upsert({
    id: data.user.id,
    phone: data.user.phone ?? phone,
    name: 'Usuario',
    email: '',
  }, { onConflict: 'id' })

  return { user: { id: data.user.id, phone: data.user.phone ?? phone }, error: null }
}

// Get current session
export async function getSession(): Promise<AuthUser | null> {
  if (!supabase) return null

  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null
  return { id: session.user.id, phone: session.user.phone ?? '' }
}

// Sign out
export async function signOut(): Promise<void> {
  if (!supabase) return
  await supabase.auth.signOut()
}
