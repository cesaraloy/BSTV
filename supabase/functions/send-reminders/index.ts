// Supabase Edge Function: send-reminders
// Triggered every 5 min by pg_cron (see schema.sql).
// Finds matches starting in 25-35 min and sends push notifications.

import { createClient } from 'jsr:@supabase/supabase-js@2'
import webpush from 'npm:web-push@3.6.7'

const SUPABASE_URL        = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const VAPID_PUBLIC_KEY    = Deno.env.get('VAPID_PUBLIC_KEY')!
const VAPID_PRIVATE_KEY   = Deno.env.get('VAPID_PRIVATE_KEY')!
const VAPID_SUBJECT       = Deno.env.get('VAPID_SUBJECT') ?? 'mailto:admin@barsporttv.com'

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

Deno.serve(async (_req) => {
  try {
    const now = new Date()
    const from = new Date(now.getTime() + 25 * 60 * 1000).toISOString()
    const to   = new Date(now.getTime() + 35 * 60 * 1000).toISOString()

    // Matches starting in the next 25-35 min
    const { data: matches, error: mErr } = await supabase
      .from('matches')
      .select('id, home_team, away_team, competition')
      .gte('match_datetime', from)
      .lte('match_datetime', to)

    if (mErr) throw mErr
    if (!matches || matches.length === 0) {
      return new Response('No upcoming matches in window', { status: 200 })
    }

    let sent = 0
    for (const match of matches) {
      // Active reminders for this match
      const { data: reminders } = await supabase
        .from('reminders')
        .select('user_id')
        .eq('match_id', match.id)
        .eq('enabled', true)

      if (!reminders?.length) continue

      const userIds = reminders.map(r => r.user_id)
      const { data: subs } = await supabase
        .from('push_subscriptions')
        .select('endpoint, p256dh, auth')
        .in('user_id', userIds)

      if (!subs?.length) continue

      const payload = JSON.stringify({
        title: `${match.home_team} vs ${match.away_team}`,
        body:  `⏰ Empieza en 30 minutos · ${match.competition}`,
        matchId: match.id,
        url: '/',
      })

      await Promise.allSettled(
        subs.map(sub =>
          webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            payload,
          )
        )
      )
      sent += subs.length
    }

    return new Response(JSON.stringify({ sent, matches: matches.length }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error(err)
    return new Response(String(err), { status: 500 })
  }
})
