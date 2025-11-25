-- Create events table
CREATE TABLE public.events (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('sports', 'cultural')),
  icon TEXT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create divisions table
CREATE TABLE public.divisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create fixtures table for scheduled matches
CREATE TABLE public.fixtures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  division_a TEXT NOT NULL,
  division_b TEXT NOT NULL,
  scheduled_date DATE,
  scheduled_time TIME,
  venue TEXT,
  phase TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create matches table for completed match results
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  fixture_id UUID REFERENCES public.fixtures(id) ON DELETE SET NULL,
  division_a TEXT NOT NULL,
  division_b TEXT NOT NULL,
  match_date DATE,
  match_time TIME,
  phase TEXT,
  result TEXT,
  winner TEXT,
  match_points_a INTEGER DEFAULT 0,
  match_points_b INTEGER DEFAULT 0,
  game_points_a INTEGER DEFAULT 0,
  game_points_b INTEGER DEFAULT 0,
  match_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create table tennis specific tie matches
CREATE TABLE public.tt_tie_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  tie_id TEXT NOT NULL,
  match_number INTEGER NOT NULL CHECK (match_number BETWEEN 1 AND 5),
  match_type TEXT NOT NULL CHECK (match_type IN ('MS', 'WS', 'MD', 'WD', 'XD')),
  team_a_players TEXT NOT NULL,
  team_b_players TEXT NOT NULL,
  winner TEXT NOT NULL CHECK (winner IN ('team_a', 'team_b')),
  score TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create standings cache table
CREATE TABLE public.standings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  division TEXT NOT NULL,
  played INTEGER DEFAULT 0,
  won INTEGER DEFAULT 0,
  lost INTEGER DEFAULT 0,
  drawn INTEGER DEFAULT 0,
  match_points INTEGER DEFAULT 0,
  game_points INTEGER DEFAULT 0,
  match_wins INTEGER DEFAULT 0,
  match_losses INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  position INTEGER,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, division)
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fixtures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tt_tie_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standings ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Public read access, authenticated write for now
CREATE POLICY "Public read access for events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public read access for divisions" ON public.divisions FOR SELECT USING (true);
CREATE POLICY "Public read access for fixtures" ON public.fixtures FOR SELECT USING (true);
CREATE POLICY "Public read access for matches" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Public read access for tt_tie_matches" ON public.tt_tie_matches FOR SELECT USING (true);
CREATE POLICY "Public read access for standings" ON public.standings FOR SELECT USING (true);

-- Authenticated users can insert/update (will add proper admin checks later)
CREATE POLICY "Authenticated insert fixtures" ON public.fixtures FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update fixtures" ON public.fixtures FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated delete fixtures" ON public.fixtures FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated insert matches" ON public.matches FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated insert tt_tie_matches" ON public.tt_tie_matches FOR INSERT TO authenticated WITH CHECK (true);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_fixtures_updated_at BEFORE UPDATE ON public.fixtures
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_standings_updated_at BEFORE UPDATE ON public.standings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();