import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DIVISIONS, SPORTS_EVENTS, CULTURAL_EVENTS, type Division } from "@/types/tournament";
import { updateScore } from "@/lib/sheets";
import { useToast } from "@/hooks/use-toast";
import { isAuthenticated } from "@/lib/auth";
import { ArrowLeft, Save, PlusCircle } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedDivision, setSelectedDivision] = useState<Division | "">("");
  const [goldMedals, setGoldMedals] = useState("");
  const [silverMedals, setSilverMedals] = useState("");
  const [bronzeMedals, setBronzeMedals] = useState("");

  if (!isAuthenticated()) {
    navigate("/auth");
    return null;
  }

  const allEvents = [...SPORTS_EVENTS, ...CULTURAL_EVENTS];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEvent || !selectedDivision) {
      toast({
        title: "Missing Information",
        description: "Please select both event and division",
        variant: "destructive",
      });
      return;
    }

    const data = {
      eventId: selectedEvent,
      division: selectedDivision,
      gold: parseInt(goldMedals) || 0,
      silver: parseInt(silverMedals) || 0,
      bronze: parseInt(bronzeMedals) || 0,
    };

    try {
      await updateScore(data);
      toast({
        title: "Score Updated",
        description: "The score has been successfully recorded",
      });
      // Reset form
      setGoldMedals("");
      setSilverMedals("");
      setBronzeMedals("");
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update the score. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="score-update" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="score-update">Update Scores</TabsTrigger>
            <TabsTrigger value="fixture-management">Manage Fixtures</TabsTrigger>
          </TabsList>

          <TabsContent value="score-update" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Update Event Scores</CardTitle>
                <CardDescription>
                  Record medals and points for each division
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="event">Select Event</Label>
                      <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                        <SelectTrigger id="event">
                          <SelectValue placeholder="Choose an event" />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                            Sports Events
                          </div>
                          {SPORTS_EVENTS.map((event) => (
                            <SelectItem key={event.id} value={event.id}>
                              {event.icon} {event.name}
                            </SelectItem>
                          ))}
                          <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground mt-2">
                            Cultural Events
                          </div>
                          {CULTURAL_EVENTS.map((event) => (
                            <SelectItem key={event.id} value={event.id}>
                              {event.icon} {event.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="division">Select Division</Label>
                      <Select value={selectedDivision} onValueChange={(value) => setSelectedDivision(value as Division)}>
                        <SelectTrigger id="division">
                          <SelectValue placeholder="Choose a division" />
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
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gold">Gold Medals</Label>
                      <Input
                        id="gold"
                        type="number"
                        min="0"
                        value={goldMedals}
                        onChange={(e) => setGoldMedals(e.target.value)}
                        placeholder="0"
                        className="bg-muted"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="silver">Silver Medals</Label>
                      <Input
                        id="silver"
                        type="number"
                        min="0"
                        value={silverMedals}
                        onChange={(e) => setSilverMedals(e.target.value)}
                        placeholder="0"
                        className="bg-muted"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bronze">Bronze Medals</Label>
                      <Input
                        id="bronze"
                        type="number"
                        min="0"
                        value={bronzeMedals}
                        onChange={(e) => setBronzeMedals(e.target.value)}
                        placeholder="0"
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    <Save className="w-4 h-4 mr-2" />
                    Submit Score Update
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fixture-management" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Fixture</CardTitle>
                <CardDescription>
                  Schedule new matches for events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <PlusCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Fixture management form coming soon</p>
                  <p className="text-sm mt-2">
                    This will allow you to add scheduled games with date, time, venue, and participating divisions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
