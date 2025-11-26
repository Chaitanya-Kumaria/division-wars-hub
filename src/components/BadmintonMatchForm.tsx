import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

interface Match {
  match_type: string;
  team_a_players: string;
  team_b_players: string;
  winner: string;
  score: string;
}

interface BadmintonMatchFormProps {
  eventId: string;
  eventName: string;
}

export default function BadmintonMatchForm({ eventId, eventName }: BadmintonMatchFormProps) {
  const [phase, setPhase] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [matches, setMatches] = useState<Match[]>([
    { match_type: "MS", team_a_players: "", team_b_players: "", winner: "", score: "" },
    { match_type: "WS", team_a_players: "", team_b_players: "", winner: "", score: "" },
    { match_type: "MD", team_a_players: "", team_b_players: "", winner: "", score: "" },
    { match_type: "WD", team_a_players: "", team_b_players: "", winner: "", score: "" },
    { match_type: "XD", team_a_players: "", team_b_players: "", winner: "", score: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateMatch = (index: number, field: keyof Match, value: string) => {
    const newMatches = [...matches];
    newMatches[index] = { ...newMatches[index], [field]: value };
    setMatches(newMatches);
  };

  const calculateTieWinner = () => {
    const teamAWins = matches.filter(m => m.winner === "team_a").length;
    const teamBWins = matches.filter(m => m.winner === "team_b").length;
    
    if (teamAWins >= 3) return { winner: "team_a", name: teamA, points: 3 };
    if (teamBWins >= 3) return { winner: "team_b", name: teamB, points: 3 };
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phase || !teamA || !teamB) {
      toast.error("Please fill in all required tie details");
      return;
    }
    
    // Auto-generate tie ID
    const tieId = `${eventId}-${teamA}-${teamB}-${Date.now()}`;

    const tieResult = calculateTieWinner();
    if (!tieResult) {
      toast.error("Please complete at least 3 matches to determine a winner");
      return;
    }

    setIsSubmitting(true);

    try {
      const { supabase } = await import("@/integrations/supabase/client");

      // Insert main match record
      const { data: matchData, error: matchError } = await supabase
        .from("matches")
        .insert([{
          event_id: eventId,
          division_a: teamA,
          division_b: teamB,
          match_date: date || null,
          match_time: time || null,
          phase,
          winner: tieResult.winner === "team_a" ? teamA : teamB,
          match_points_a: tieResult.winner === "team_a" ? tieResult.points : 0,
          match_points_b: tieResult.winner === "team_b" ? tieResult.points : 0,
          match_data: { tie_id: tieId, tie_result: tieResult }
        }])
        .select()
        .single();

      if (matchError) throw matchError;

      // Insert individual tie matches
      const tieMatches = matches
        .filter(m => m.winner && m.team_a_players && m.team_b_players)
        .map((m, index) => ({
          match_id: matchData.id,
          tie_id: tieId,
          match_number: index + 1,
          match_type: m.match_type,
          team_a_players: m.team_a_players,
          team_b_players: m.team_b_players,
          winner: m.winner,
          score: m.score || null
        }));

      if (tieMatches.length > 0) {
        const { error: tieMatchesError } = await supabase
          .from("tt_tie_matches")
          .insert(tieMatches);

        if (tieMatchesError) throw tieMatchesError;
      }

      toast.success(`Tie result recorded! ${tieResult.name} wins (${tieResult.points} points)`);
      
      // Reset form
      setPhase("");
      setDate("");
      setTime("");
      setTeamA("");
      setTeamB("");
      setMatches([
        { match_type: "MS", team_a_players: "", team_b_players: "", winner: "", score: "" },
        { match_type: "WS", team_a_players: "", team_b_players: "", winner: "", score: "" },
        { match_type: "MD", team_a_players: "", team_b_players: "", winner: "", score: "" },
        { match_type: "WD", team_a_players: "", team_b_players: "", winner: "", score: "" },
        { match_type: "XD", team_a_players: "", team_b_players: "", winner: "", score: "" },
      ]);
    } catch (error) {
      console.error("Error submitting tie result:", error);
      toast.error("Failed to submit tie result");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tieResult = calculateTieWinner();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Badminton Match Entry - {eventName}</CardTitle>
        <CardDescription>Enter tie details and match results (Best of 5)</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tie Details */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold">Tie Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phase">Phase *</Label>
                <Select value={phase} onValueChange={setPhase} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select phase" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Phase 1">Phase 1</SelectItem>
                    <SelectItem value="Phase 2">Phase 2</SelectItem>
                    <SelectItem value="Semi-Final">Semi-Final</SelectItem>
                    <SelectItem value="Final">Final</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="team-a">Team A *</Label>
                <Input
                  id="team-a"
                  value={teamA}
                  onChange={(e) => setTeamA(e.target.value)}
                  placeholder="Division name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="team-b">Team B *</Label>
                <Input
                  id="team-b"
                  value={teamB}
                  onChange={(e) => setTeamB(e.target.value)}
                  placeholder="Division name"
                  required
                />
              </div>
            </div>
          </div>

          {/* Match Results */}
          <div className="space-y-4">
            <h3 className="font-semibold">Match Results (First to 3 wins)</h3>
            {matches.map((match, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <h4 className="font-medium">Match {index + 1} - {match.match_type}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Team A Player(s) *</Label>
                    <Input
                      value={match.team_a_players}
                      onChange={(e) => updateMatch(index, "team_a_players", e.target.value)}
                      placeholder="Player name(s)"
                      required
                    />
                  </div>
                  <div>
                    <Label>Team B Player(s) *</Label>
                    <Input
                      value={match.team_b_players}
                      onChange={(e) => updateMatch(index, "team_b_players", e.target.value)}
                      placeholder="Player name(s)"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label>Winner *</Label>
                  <RadioGroup
                    value={match.winner}
                    onValueChange={(value) => updateMatch(index, "winner", value)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="team_a" id={`winner-a-${index}`} />
                        <Label htmlFor={`winner-a-${index}`}>Team A</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="team_b" id={`winner-b-${index}`} />
                        <Label htmlFor={`winner-b-${index}`}>Team B</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label>Score (optional)</Label>
                  <Input
                    value={match.score}
                    onChange={(e) => updateMatch(index, "score", e.target.value)}
                    placeholder="e.g., 21-15, 21-18"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Tie Result */}
          {tieResult && (
            <div className="p-4 bg-primary/10 border-2 border-primary rounded-lg">
              <h3 className="font-semibold mb-2">Tie Result</h3>
              <p className="text-lg">
                <strong>Winner:</strong> {tieResult.name}
              </p>
              <p>
                <strong>Points Awarded:</strong> {tieResult.points} (Win = 3, Loss = 0)
              </p>
            </div>
          )}

          <Button type="submit" disabled={isSubmitting || !tieResult} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Tie Result"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
