-- ============================================================
-- BSTV – Carga completa de equipos
-- Ejecutar en: Supabase → SQL Editor
-- ============================================================

-- 1. Limpia la tabla y vuelve a insertar
TRUNCATE TABLE teams RESTART IDENTITY CASCADE;

-- 2. Inserta todos los equipos (competition = campo que agrupa)
INSERT INTO teams (id, name, competition, logo_url, country) VALUES

-- ── LaLiga ──────────────────────────────────────────────────
(gen_random_uuid(), 'Real Madrid',          'LaLiga', '', 'España'),
(gen_random_uuid(), 'FC Barcelona',          'LaLiga', '', 'España'),
(gen_random_uuid(), 'Atlético de Madrid',    'LaLiga', '', 'España'),
(gen_random_uuid(), 'Athletic Club',         'LaLiga', '', 'España'),
(gen_random_uuid(), 'Villarreal CF',         'LaLiga', '', 'España'),
(gen_random_uuid(), 'Real Sociedad',         'LaLiga', '', 'España'),
(gen_random_uuid(), 'Real Betis',            'LaLiga', '', 'España'),
(gen_random_uuid(), 'Sevilla FC',            'LaLiga', '', 'España'),
(gen_random_uuid(), 'Girona FC',             'LaLiga', '', 'España'),
(gen_random_uuid(), 'RC Celta',              'LaLiga', '', 'España'),
(gen_random_uuid(), 'CA Osasuna',            'LaLiga', '', 'España'),
(gen_random_uuid(), 'Rayo Vallecano',        'LaLiga', '', 'España'),
(gen_random_uuid(), 'Getafe CF',             'LaLiga', '', 'España'),
(gen_random_uuid(), 'Valencia CF',           'LaLiga', '', 'España'),
(gen_random_uuid(), 'RCD Espanyol',          'LaLiga', '', 'España'),
(gen_random_uuid(), 'RCD Mallorca',          'LaLiga', '', 'España'),
(gen_random_uuid(), 'Deportivo Alavés',      'LaLiga', '', 'España'),
(gen_random_uuid(), 'Real Valladolid',       'LaLiga', '', 'España'),
(gen_random_uuid(), 'UD Las Palmas',         'LaLiga', '', 'España'),
(gen_random_uuid(), 'CD Leganés',            'LaLiga', '', 'España'),

-- ── LaLiga Hypermotion ───────────────────────────────────────
(gen_random_uuid(), 'Real Zaragoza',         'LaLiga Hypermotion', '', 'España'),
(gen_random_uuid(), 'SD Eibar',              'LaLiga Hypermotion', '', 'España'),
(gen_random_uuid(), 'Levante UD',            'LaLiga Hypermotion', '', 'España'),
(gen_random_uuid(), 'Sporting de Gijón',     'LaLiga Hypermotion', '', 'España'),
(gen_random_uuid(), 'Deportivo de La Coruña','LaLiga Hypermotion', '', 'España'),
(gen_random_uuid(), 'Real Oviedo',           'LaLiga Hypermotion', '', 'España'),
(gen_random_uuid(), 'SD Huesca',             'LaLiga Hypermotion', '', 'España'),
(gen_random_uuid(), 'Mirandés',              'LaLiga Hypermotion', '', 'España'),
(gen_random_uuid(), 'Burgos CF',             'LaLiga Hypermotion', '', 'España'),
(gen_random_uuid(), 'Racing de Santander',   'LaLiga Hypermotion', '', 'España'),
(gen_random_uuid(), 'UD Almería',            'LaLiga Hypermotion', '', 'España'),
(gen_random_uuid(), 'CD Tenerife',           'LaLiga Hypermotion', '', 'España'),
(gen_random_uuid(), 'Málaga CF',             'LaLiga Hypermotion', '', 'España'),
(gen_random_uuid(), 'CD Castellón',          'LaLiga Hypermotion', '', 'España'),
(gen_random_uuid(), 'FC Andorra',            'LaLiga Hypermotion', '', 'Andorra'),
(gen_random_uuid(), 'CD Eldense',            'LaLiga Hypermotion', '', 'España'),

-- ── Premier League ───────────────────────────────────────────
(gen_random_uuid(), 'Arsenal',               'Premier League', '', 'Inglaterra'),
(gen_random_uuid(), 'Chelsea',               'Premier League', '', 'Inglaterra'),
(gen_random_uuid(), 'Liverpool',             'Premier League', '', 'Inglaterra'),
(gen_random_uuid(), 'Manchester City',       'Premier League', '', 'Inglaterra'),
(gen_random_uuid(), 'Manchester United',     'Premier League', '', 'Inglaterra'),
(gen_random_uuid(), 'Tottenham Hotspur',     'Premier League', '', 'Inglaterra'),
(gen_random_uuid(), 'Newcastle United',      'Premier League', '', 'Inglaterra'),
(gen_random_uuid(), 'Aston Villa',           'Premier League', '', 'Inglaterra'),
(gen_random_uuid(), 'West Ham United',       'Premier League', '', 'Inglaterra'),
(gen_random_uuid(), 'Brighton',              'Premier League', '', 'Inglaterra'),
(gen_random_uuid(), 'Brentford',             'Premier League', '', 'Inglaterra'),
(gen_random_uuid(), 'Wolverhampton',         'Premier League', '', 'Inglaterra'),
(gen_random_uuid(), 'Crystal Palace',        'Premier League', '', 'Inglaterra'),
(gen_random_uuid(), 'Fulham',                'Premier League', '', 'Inglaterra'),
(gen_random_uuid(), 'Everton',               'Premier League', '', 'Inglaterra'),
(gen_random_uuid(), 'Nottingham Forest',     'Premier League', '', 'Inglaterra'),
(gen_random_uuid(), 'Bournemouth',           'Premier League', '', 'Inglaterra'),
(gen_random_uuid(), 'Leicester City',        'Premier League', '', 'Inglaterra'),
(gen_random_uuid(), 'Ipswich Town',          'Premier League', '', 'Inglaterra'),
(gen_random_uuid(), 'Southampton',           'Premier League', '', 'Inglaterra'),

-- ── Champions League (clubes no españoles ni ingleses) ───────
(gen_random_uuid(), 'Bayern Múnich',         'Champions League', '', 'Alemania'),
(gen_random_uuid(), 'Borussia Dortmund',     'Champions League', '', 'Alemania'),
(gen_random_uuid(), 'Bayer Leverkusen',      'Champions League', '', 'Alemania'),
(gen_random_uuid(), 'RB Leipzig',            'Champions League', '', 'Alemania'),
(gen_random_uuid(), 'PSG',                   'Champions League', '', 'Francia'),
(gen_random_uuid(), 'Monaco',                'Champions League', '', 'Francia'),
(gen_random_uuid(), 'Lille',                 'Champions League', '', 'Francia'),
(gen_random_uuid(), 'Inter de Milán',        'Champions League', '', 'Italia'),
(gen_random_uuid(), 'AC Milan',              'Champions League', '', 'Italia'),
(gen_random_uuid(), 'Juventus',              'Champions League', '', 'Italia'),
(gen_random_uuid(), 'Atalanta',              'Champions League', '', 'Italia'),
(gen_random_uuid(), 'Benfica',               'Champions League', '', 'Portugal'),
(gen_random_uuid(), 'Sporting CP',           'Champions League', '', 'Portugal'),
(gen_random_uuid(), 'Porto',                 'Champions League', '', 'Portugal'),
(gen_random_uuid(), 'Ajax',                  'Champions League', '', 'Países Bajos'),
(gen_random_uuid(), 'PSV',                   'Champions League', '', 'Países Bajos'),
(gen_random_uuid(), 'Feyenoord',             'Champions League', '', 'Países Bajos'),

-- ── Europa League ────────────────────────────────────────────
(gen_random_uuid(), 'Lazio',                 'Europa League', '', 'Italia'),
(gen_random_uuid(), 'Fiorentina',            'Europa League', '', 'Italia'),
(gen_random_uuid(), 'AS Roma',               'Europa League', '', 'Italia'),
(gen_random_uuid(), 'Napoli',                'Europa League', '', 'Italia'),
(gen_random_uuid(), 'Eintracht Frankfurt',   'Europa League', '', 'Alemania'),
(gen_random_uuid(), 'Olympique de Marseille','Europa League', '', 'Francia'),
(gen_random_uuid(), 'Olympique Lyon',        'Europa League', '', 'Francia'),
(gen_random_uuid(), 'Fenerbahçe',            'Europa League', '', 'Turquía'),
(gen_random_uuid(), 'Galatasaray',           'Europa League', '', 'Turquía'),

-- ── Women''s Champions League ────────────────────────────────
(gen_random_uuid(), 'FC Barcelona W',        'Women''s Champions League', '', 'España'),
(gen_random_uuid(), 'Chelsea W',             'Women''s Champions League', '', 'Inglaterra'),
(gen_random_uuid(), 'Arsenal W',             'Women''s Champions League', '', 'Inglaterra'),
(gen_random_uuid(), 'Manchester City W',     'Women''s Champions League', '', 'Inglaterra'),
(gen_random_uuid(), 'Lyon W',                'Women''s Champions League', '', 'Francia'),
(gen_random_uuid(), 'PSG W',                 'Women''s Champions League', '', 'Francia'),
(gen_random_uuid(), 'Bayern W',              'Women''s Champions League', '', 'Alemania'),
(gen_random_uuid(), 'VfL Wolfsburg W',       'Women''s Champions League', '', 'Alemania'),
(gen_random_uuid(), 'Manchester Utd W',      'Women''s Champions League', '', 'Inglaterra'),

-- ── MotoGP ───────────────────────────────────────────────────
(gen_random_uuid(), 'Marc Márquez',          'MotoGP', '', 'España'),
(gen_random_uuid(), 'Francesco Bagnaia',     'MotoGP', '', 'Italia'),
(gen_random_uuid(), 'Jorge Martín',          'MotoGP', '', 'España'),
(gen_random_uuid(), 'Maverick Viñales',      'MotoGP', '', 'España'),
(gen_random_uuid(), 'Pedro Acosta',          'MotoGP', '', 'España'),
(gen_random_uuid(), 'Fabio Quartararo',      'MotoGP', '', 'Francia'),
(gen_random_uuid(), 'Enea Bastianini',       'MotoGP', '', 'Italia'),
(gen_random_uuid(), 'Brad Binder',           'MotoGP', '', 'Sudáfrica'),

-- ── Formula 1 ────────────────────────────────────────────────
(gen_random_uuid(), 'Max Verstappen',        'Formula 1', '', 'Países Bajos'),
(gen_random_uuid(), 'Lewis Hamilton',        'Formula 1', '', 'Reino Unido'),
(gen_random_uuid(), 'Charles Leclerc',       'Formula 1', '', 'Mónaco'),
(gen_random_uuid(), 'Carlos Sainz',          'Formula 1', '', 'España'),
(gen_random_uuid(), 'Fernando Alonso',       'Formula 1', '', 'España'),
(gen_random_uuid(), 'Lando Norris',          'Formula 1', '', 'Reino Unido'),
(gen_random_uuid(), 'George Russell',        'Formula 1', '', 'Reino Unido'),
(gen_random_uuid(), 'Oscar Piastri',         'Formula 1', '', 'Australia'),
(gen_random_uuid(), 'Sergio Pérez',          'Formula 1', '', 'México');

-- ── Verificación ─────────────────────────────────────────────
SELECT competition, COUNT(*) as total
FROM teams
GROUP BY competition
ORDER BY competition;
