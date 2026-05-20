import { supabase } from './supabase'

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY ?? ''

function urlBase64ToUint8Array(b64: string): ArrayBuffer {
  const padding = '='.repeat((4 - (b64.length % 4)) % 4)
  const base64 = (b64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const buf = new ArrayBuffer(raw.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i < raw.length; i++) view[i] = raw.charCodeAt(i)
  return buf
}

export function notificationsSupported(): boolean {
  return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window
}

export async function requestPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied'
  if (Notification.permission !== 'default') return Notification.permission
  return Notification.requestPermission()
}

// ── Web Push (logged-in users) ─────────────────────────────────────
export async function subscribeToPush(userId: string): Promise<boolean> {
  if (!notificationsSupported() || !VAPID_PUBLIC_KEY) return false
  try {
    const reg = await navigator.serviceWorker.ready
    let sub = await reg.pushManager.getSubscription()
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })
    }
    const json = sub.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } }
    if (supabase) {
      await supabase.from('push_subscriptions').upsert(
        { user_id: userId, endpoint: json.endpoint, p256dh: json.keys.p256dh, auth: json.keys.auth },
        { onConflict: 'user_id,endpoint' },
      )
    }
    return true
  } catch (err) {
    console.error('subscribeToPush:', err)
    return false
  }
}

// ── Local notification (anonymous users / same-session fallback) ───
export function scheduleLocalNotification(
  matchId: string,
  homeTeam: string,
  awayTeam: string,
  matchTime: string,
  matchDate: string,
  advanceMinutes = 30,
) {
  if (Notification.permission !== 'granted') return
  const now = new Date()
  const [h, m] = matchTime.split(':').map(Number)
  let day = new Date(now)
  if (matchDate === 'MAÑANA') day.setDate(day.getDate() + 1)
  else if (matchDate !== 'HOY') {
    const [dd, mm] = matchDate.split('/').map(Number)
    day = new Date(now.getFullYear(), mm - 1, dd)
  }
  day.setHours(h, m, 0, 0)
  const delay = day.getTime() - advanceMinutes * 60 * 1000 - Date.now()
  if (delay <= 0 || delay > 24 * 60 * 60 * 1000) return
  setTimeout(() => {
    new Notification(`⚽ ${homeTeam} vs ${awayTeam}`, {
      body: `El partido empieza en ${advanceMinutes} minutos`,
      icon: '/favicon.svg',
      tag: `match-${matchId}`,
    })
  }, delay)
}
