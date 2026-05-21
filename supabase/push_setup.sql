-- ─── Push notification setup — run once in Supabase SQL editor ────
-- Adds sent + notif_advance columns and creates the pg_cron job.
-- Requires pg_cron and pg_net extensions (enabled by default in Supabase).

-- 1. Track whether a reminder notification has already been sent
ALTER TABLE public.reminders
  ADD COLUMN IF NOT EXISTS sent boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS notif_advance int DEFAULT 30;

-- 2. Store the computed UTC send time on each reminder row
--    (reminder_time column already exists from schema.sql)

-- 3. Enable extensions (safe to run even if already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 4. Schedule the Edge Function every 5 minutes
--    Replace YOUR_PROJECT_REF and YOUR_SERVICE_ROLE_KEY below.
SELECT cron.schedule(
  'bstv-send-reminders',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url     := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-reminders',
    headers := '{"Authorization":"Bearer YOUR_SERVICE_ROLE_KEY","Content-Type":"application/json"}',
    body    := '{}'::jsonb
  );
  $$
);
