-- ─── Match sync setup — run once in the Supabase SQL editor ────────
-- Adds external_id column for idempotent upserts from football-data.org
-- and schedules the daily sync-matches Edge Function via pg_cron.
--
-- Prerequisites:
--   • push_setup.sql already applied (pg_cron + pg_net enabled)
--   • FOOTBALL_DATA_API_KEY set as a Supabase secret:
--       supabase secrets set FOOTBALL_DATA_API_KEY=<your-key>
--   • sync-matches Edge Function deployed:
--       supabase functions deploy sync-matches

-- 1. Add external_id for dedup (football-data.org match ID prefix: "fd-<id>")
ALTER TABLE public.matches
  ADD COLUMN IF NOT EXISTS external_id text UNIQUE;

-- 2. Schedule sync-matches daily at 01:00 UTC
--    (02:00 Madrid in winter / 03:00 Madrid in summer — well before morning traffic)
--    Replace YOUR_PROJECT_REF and YOUR_SERVICE_ROLE_KEY below.
SELECT cron.schedule(
  'bstv-sync-matches',
  '0 1 * * *',
  $$
  SELECT net.http_post(
    url     := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/sync-matches',
    headers := '{"Authorization":"Bearer YOUR_SERVICE_ROLE_KEY","Content-Type":"application/json"}',
    body    := '{}'::jsonb
  );
  $$
);

-- To verify the job was created:
-- SELECT jobid, jobname, schedule, command FROM cron.job WHERE jobname = 'bstv-sync-matches';

-- To run it immediately (one-off test):
-- SELECT net.http_post(
--   url     := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/sync-matches',
--   headers := '{"Authorization":"Bearer YOUR_SERVICE_ROLE_KEY","Content-Type":"application/json"}',
--   body    := '{}'::jsonb
-- );

-- To remove the job if needed:
-- SELECT cron.unschedule('bstv-sync-matches');
