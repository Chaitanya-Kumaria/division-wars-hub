import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DIVISIONS } from "@/types/tournament";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MatchEntryFormProps {
  eventId: string;
  eventName: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MatchEntryForm = ({ eventId, eventName }: MatchEntryFormProps) => {
  const { toast } = useToast();
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [result, setResult] = useState("");
  const [matchPoints, setMatchPoints] = useState("");
  const [gamePoints, setGamePoints] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!team1 || !team2 || !result) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (team1 === team2) {
      toast({
        title: "Invalid Match",
        description: "Team 1 and Team 2 must be different",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const matchData = {
      eventId,
      team1,
      team2,
      result,
      match_points: parseFloat(matchPoints) || (result === 'win' ? 2 : result === 'draw' ? 1 : 0),
      game_points: parseFloat(gamePoints) || (result === 'win' ? 1 : result === 'draw' ? 0.5 : 0),
      date: new Date().toISOString().split('T')[0],
      round: 1
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/match/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add match');
      }

      toast({
        title: "Match Added",
        description: `Match result recorded successfully for ${eventName}`,
      });

      // Reset form
      setTeam1("");
      setTeam2("");
      setResult("");
      setMatchPoints("");
      setGamePoints("");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add match",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Match Result - {eventName}</CardTitle>
        <CardDescription>
          Record match-by-match results. Final standings will be calculated automatically.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="team1">Team 1 (Division)</Label>
              <Select value={team1} onValueChange={setTeam1}>
                <SelectTrigger id="team1">
                  <SelectValue placeholder="Select team 1" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DIVISIONS).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      Division {key} - {value.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="team2">Team 2 (Division)</Label>
              <Select value={team2} onValueChange={setTeam2}>
                <SelectTrigger id="team2">
                  <SelectValue placeholder="Select team 2" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DIVISIONS)
                    .filter(([key]) => key !== team1)
                    .map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        Division {key} - {value.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="result">Match Result (for Team 1)</Label>
            <Select value={result} onValueChange={setResult}>
              <SelectTrigger id="result">
                <SelectValue placeholder="Select result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="win">Win</SelectItem>
                <SelectItem value="draw">Draw</SelectItem>
                <SelectItem value="loss">Loss</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="matchPoints">Match Points (optional)</Label>
              <Input
                id="matchPoints"
                type="number"
                step="0.5"
                value={matchPoints}
                onChange={(e) => setMatchPoints(e.target.value)}
                placeholder="Auto-calculated"
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Win: 2, Draw: 1, Loss: 0
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gamePoints">Game Points (optional)</Label>
              <Input
                id="gamePoints"
                type="number"
                step="0.5"
                value={gamePoints}
                onChange={(e) => setGamePoints(e.target.value)}
                placeholder="Auto-calculated"
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Win: 1, Draw: 0.5, Loss: 0
              </p>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90"
            disabled={isSubmitting}
          >
            <Plus className="w-4 h-4 mr-2" />
            {isSubmitting ? "Adding Match..." : "Add Match Result"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MatchEntryForm;
