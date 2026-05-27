-- ─── Venue schedule — run once in the Supabase SQL editor ──────────
-- Adds a JSONB column to store per-day opening hours with support
-- for multiple slots per day (e.g. lunch + dinner shifts).
--
-- Format per venue:
-- {
--   "mon": [{ "open": "16:00", "close": "02:00" }],
--   "fri": [{ "open": "16:00", "close": "20:00" }, { "open": "22:00", "close": "04:00" }],
--   "sat": [{ "open": "12:00", "close": "04:00" }],
--   "sun": []   -- closed
-- }
-- Days not present in the object are treated as closed.
-- Keys: mon tue wed thu fri sat sun

ALTER TABLE public.venues
  ADD COLUMN IF NOT EXISTS schedule jsonb;

-- Example update for a single venue:
-- UPDATE public.venues
-- SET schedule = '{
--   "mon": [{"open":"18:00","close":"02:00"}],
--   "tue": [{"open":"18:00","close":"02:00"}],
--   "wed": [{"open":"18:00","close":"02:00"}],
--   "thu": [{"open":"18:00","close":"02:00"}],
--   "fri": [{"open":"16:00","close":"20:00"},{"open":"22:00","close":"04:00"}],
--   "sat": [{"open":"12:00","close":"04:00"}],
--   "sun": [{"open":"12:00","close":"00:00"}]
-- }'::jsonb
-- WHERE name = 'Nombre del bar';
