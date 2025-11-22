import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StandingsTable from "@/components/StandingsTable";
import { SPORTS_EVENTS, CULTURAL_EVENTS, type Standings } from "@/types/tournament";
import { fetchStandings, fetchSportsStandings, fetchCulturalStandings } from "@/lib/sheets";
import { isAuthenticated, setAuthenticated } from "@/lib/auth";
import { Trophy, LogOut, UserCog, Activity, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [overallStandings, setOverallStandings] = useState<Standings[]>([]);
  const [sportsStandings, setSportsStandings] = useState<Standings[]>([]);
  const [culturalStandings, setCulturalStandings] = useState<Standings[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isScorer = isAuthenticated();

  useEffect(() => {
    loadStandings();
  }, []);

  const loadStandings = async () => {
    const [overall, sports, cultural] = await Promise.all([
      fetchStandings(),
      fetchSportsStandings(),
      fetchCulturalStandings(),
    ]);
    setOverallStandings(overall);
    setSportsStandings(sports);
    setCulturalStandings(cultural);
  };

  const handleLogout = () => {
    setAuthenticated(false);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    navigate("/auth");
  };

  const handleEventClick = (eventId: string, type: "sports" | "cultural") => {
    navigate(`/event/${eventId}?type=${type}`);
  };

  const handleAdminClick = () => {
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Division Wars
                </h1>
                <p className="text-sm text-muted-foreground">SP Jain Tournament</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isScorer && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAdminClick}
                    className="border-primary/50"
                  >
                    <UserCog className="w-4 h-4 mr-2" />
                    Admin Panel
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              )}
              {!isScorer && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/auth")}
                  className="border-primary/50"
                >
                  Scorer Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Overall Standings */}
        <section>
          <Card className="border-2 border-primary/30 shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Trophy className="w-8 h-8 text-primary" />
                Overall Standings
              </CardTitle>
              <CardDescription>
                Live rankings across all events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StandingsTable standings={overallStandings} />
            </CardContent>
          </Card>
        </section>

        {/* Sports & Cultural Tabs */}
        <Tabs defaultValue="sports" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-14">
            <TabsTrigger value="sports" className="text-lg">
              <Activity className="w-5 h-5 mr-2" />
              Sports Events
            </TabsTrigger>
            <TabsTrigger value="cultural" className="text-lg">
              <Sparkles className="w-5 h-5 mr-2" />
              Cultural Events
            </TabsTrigger>
          </TabsList>

          {/* Sports Tab */}
          <TabsContent value="sports" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Sports Standings</CardTitle>
              </CardHeader>
              <CardContent>
                <StandingsTable standings={sportsStandings} showType />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sports Events</CardTitle>
                <CardDescription>
                  Click on an event to view fixtures and results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {SPORTS_EVENTS.map((event) => (
                    <Button
                      key={event.id}
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary/10 hover:border-primary transition-all"
                      onClick={() => handleEventClick(event.id, "sports")}
                    >
                      <span className="text-3xl">{event.icon}</span>
                      <span className="text-sm font-medium text-center">{event.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cultural Tab */}
          <TabsContent value="cultural" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Cultural Standings</CardTitle>
              </CardHeader>
              <CardContent>
                <StandingsTable standings={culturalStandings} showType />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cultural Events</CardTitle>
                <CardDescription>
                  Click on an event to view fixtures and results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {CULTURAL_EVENTS.map((event) => (
                    <Button
                      key={event.id}
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-secondary/10 hover:border-secondary transition-all"
                      onClick={() => handleEventClick(event.id, "cultural")}
                    >
                      <span className="text-3xl">{event.icon}</span>
                      <span className="text-sm font-medium text-center">{event.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
