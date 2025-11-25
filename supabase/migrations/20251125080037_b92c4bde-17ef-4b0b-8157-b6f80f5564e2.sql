-- Update RLS policies to allow public access for admin operations
-- (In production, you should add proper authentication)

DROP POLICY IF EXISTS "Authenticated insert fixtures" ON public.fixtures;
DROP POLICY IF EXISTS "Authenticated update fixtures" ON public.fixtures;
DROP POLICY IF EXISTS "Authenticated delete fixtures" ON public.fixtures;
DROP POLICY IF EXISTS "Authenticated insert matches" ON public.matches;
DROP POLICY IF EXISTS "Authenticated insert tt_tie_matches" ON public.tt_tie_matches;

-- Allow public write access for fixtures
CREATE POLICY "Public insert fixtures" ON public.fixtures FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update fixtures" ON public.fixtures FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete fixtures" ON public.fixtures FOR DELETE USING (true);

-- Allow public write access for matches
CREATE POLICY "Public insert matches" ON public.matches FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update matches" ON public.matches FOR UPDATE USING (true) WITH CHECK (true);

-- Allow public write access for tt_tie_matches
CREATE POLICY "Public insert tt_tie_matches" ON public.tt_tie_matches FOR INSERT WITH CHECK (true);

-- Allow public write access for standings
CREATE POLICY "Public insert standings" ON public.standings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update standings" ON public.standings FOR UPDATE USING (true) WITH CHECK (true);

-- Function to automatically update standings for Table Tennis
CREATE OR REPLACE FUNCTION update_tt_standings()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  winner_div TEXT;
  loser_div TEXT;
  winner_points INTEGER := 3;
  loser_points INTEGER := 0;
BEGIN
  -- Determine winner and loser
  IF NEW.winner = NEW.division_a THEN
    winner_div := NEW.division_a;
    loser_div := NEW.division_b;
  ELSE
    winner_div := NEW.division_b;
    loser_div := NEW.division_a;
  END IF;

  -- Update winner standings
  INSERT INTO public.standings (event_id, division, played, won, points)
  VALUES (NEW.event_id, winner_div, 1, 1, winner_points)
  ON CONFLICT (event_id, division) 
  DO UPDATE SET
    played = standings.played + 1,
    won = standings.won + 1,
    points = standings.points + winner_points,
    updated_at = now();

  -- Update loser standings
  INSERT INTO public.standings (event_id, division, played, lost, points)
  VALUES (NEW.event_id, loser_div, 1, 1, loser_points)
  ON CONFLICT (event_id, division)
  DO UPDATE SET
    played = standings.played + 1,
    lost = standings.lost + 1,
    points = standings.points + loser_points,
    updated_at = now();

  RETURN NEW;
END;
$$;

-- Trigger to auto-update standings when a match is recorded
CREATE TRIGGER auto_update_standings_trigger
AFTER INSERT ON public.matches
FOR EACH ROW
WHEN (NEW.event_id = 'table-tennis')
EXECUTE FUNCTION update_tt_standings();