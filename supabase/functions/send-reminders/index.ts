// Supabase Edge Function: send-reminders
// Triggered every 5 min by pg_cron (see push_setup.sql).
// Finds reminder rows whose reminder_time falls in the next 5-min window,
// sends Web Push, then marks sent=true to avoid duplicates.
// Respects per-reminder notif_advance so each user gets notified at their
// chosen lead time (15 / 30 / 60 min).

import { createClient } from 'jsr:@supabase/supabase-js@2'
import webpush from 'npm:web-push@3.6.7'

const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const VAPID_PUBLIC_KEY     = Deno.env.get('VAPID_PUBLIC_KEY')!
const VAPID_PRIVATE_KEY    = Deno.env.get('VAPID_PRIVATE_KEY')!
const VAPID_SUBJECT        = Deno.env.get('VAPID_SUBJECT') ?? 'mailto:admin@barsporttv.com'

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

Deno.serve(async (_req) => {
  try {
    const now       = new Date()
    const windowEnd = new Date(now.getTime() + 5 * 60 * 1000)

    // Reminders due in the next 5-minute window that haven't been sent yet
    const { data: reminders, error: rErr } = await supabase
      .from('reminders')
      .select('id, user_id, match_id, notif_advance')
      .eq('enabled', true)
      .eq('sent', false)
      .gte('reminder_time', now.toISOString())
      .lt('reminder_time', windowEnd.toISOString())

    if (rErr) throw rErr
    if (!reminders?.length) {
      return new Response(JSON.stringify({ sent: 0 }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Batch-fetch match details
    const matchIds = [...new Set(reminders.map(r => r.match_id))]
    const { data: matches } = await supabase
      .from('matches')
      .select('id, home_team, away_team, competition')
      .in('id', matchIds)

    const matchMap = Object.fromEntries((matches ?? []).map(m => [m.id, m]))

    let sent = 0
    for (const reminder of reminders) {
      const match = matchMap[reminder.match_id]
      if (!match) continue

      const { data: subs } = await supabase
        .from('push_subscriptions')
        .select('endpoint, p256dh, auth')
        .eq('user_id', reminder.user_id)

      if (!subs?.length) {
        await supabase.from('reminders').update({ sent: true }).eq('id', reminder.id)
        continue
      }

      const advance = reminder.notif_advance ?? 30
      const payload = JSON.stringify({
        title:   `⚽ ${match.home_team} vs ${match.away_team}`,
        body:    `El partido empieza en ${advance} minutos · ${match.competition}`,
        matchId: reminder.match_id,
        url:     '/',
      })

      await Promise.allSettled(
        subs.map(sub =>
          webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            payload,
          ).catch(err => {
            if (err?.statusCode === 410) {
              // Subscription expired — clean it up
              return supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint)
            }
          })
        )
      )

      await supabase.from('reminders').update({ sent: true }).eq('id', reminder.id)
      sent += subs.length
    }

    return new Response(JSON.stringify({ sent, processed: reminders.length }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error(err)
    return new Response(String(err), { status: 500 })
  }
})
