import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StandingsTable from "@/components/StandingsTable";
import { SPORTS_EVENTS, CULTURAL_EVENTS, DIVISIONS, type Standings, type Fixture } from "@/types/tournament";
import { fetchEventStandings, fetchFixtures } from "@/lib/sheets";
import { ArrowLeft, Calendar, Trophy, BookOpen } from "lucide-react";

const EventDetail = () => {
  const { eventId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = searchParams.get("type") as "sports" | "cultural";
  
  const [standings, setStandings] = useState<Standings[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  
  const allEvents = [...SPORTS_EVENTS, ...CULTURAL_EVENTS];
  const event = allEvents.find(e => e.id === eventId);

  useEffect(() => {
    if (eventId) {
      loadEventData();
    }
  }, [eventId]);

  const loadEventData = async () => {
    if (!eventId) return;
    const [standingsData, fixturesData] = await Promise.all([
      fetchEventStandings(eventId),
      fetchFixtures(eventId),
    ]);
    setStandings(standingsData);
    setFixtures(fixturesData);
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event not found</h1>
          <Button onClick={() => navigate("/")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const scheduledFixtures = fixtures.filter(f => f.status === "scheduled");
  const completedFixtures = fixtures.filter(f => f.status === "completed");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{event.icon}</span>
              <div>
                <h1 className="text-2xl font-bold">{event.name}</h1>
                <p className="text-sm text-muted-foreground capitalize">{type} Event</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Event Standings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-primary" />
              Event Standings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StandingsTable standings={standings} />
          </CardContent>
        </Card>

        {/* Tabs for Schedule, Results, Rules */}
        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="schedule">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="results">
              <Trophy className="w-4 h-4 mr-2" />
              Results
            </TabsTrigger>
            <TabsTrigger value="rules">
              <BookOpen className="w-4 h-4 mr-2" />
              Rule Book
            </TabsTrigger>
          </TabsList>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Fixtures</CardTitle>
              </CardHeader>
              <CardContent>
                {scheduledFixtures.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No scheduled fixtures yet. Check back soon!
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Division 1</TableHead>
                        <TableHead className="text-center">VS</TableHead>
                        <TableHead>Division 2</TableHead>
                        <TableHead>Venue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scheduledFixtures.map((fixture) => (
                        <TableRow key={fixture.id}>
                          <TableCell>
                            <div className="font-medium">{fixture.date}</div>
                            <div className="text-sm text-muted-foreground">{fixture.time}</div>
                          </TableCell>
                          <TableCell className="font-semibold">
                            Division {fixture.division1} - {DIVISIONS[fixture.division1].name}
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground">vs</TableCell>
                          <TableCell className="font-semibold">
                            Division {fixture.division2} - {DIVISIONS[fixture.division2].name}
                          </TableCell>
                          <TableCell>{fixture.venue}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Match Results</CardTitle>
              </CardHeader>
              <CardContent>
                {completedFixtures.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No results available yet. Matches coming soon!
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Division 1</TableHead>
                        <TableHead className="text-center">Score</TableHead>
                        <TableHead>Division 2</TableHead>
                        <TableHead>Winner</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedFixtures.map((fixture) => (
                        <TableRow key={fixture.id}>
                          <TableCell>{fixture.date}</TableCell>
                          <TableCell>
                            Division {fixture.division1} - {DIVISIONS[fixture.division1].name}
                          </TableCell>
                          <TableCell className="text-center font-mono">
                            {fixture.score || "N/A"}
                          </TableCell>
                          <TableCell>
                            Division {fixture.division2} - {DIVISIONS[fixture.division2].name}
                          </TableCell>
                          <TableCell className="font-semibold text-primary">
                            {fixture.winner && `Division ${fixture.winner}`}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rules Tab */}
          <TabsContent value="rules" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Rules & Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none">
                <div className="space-y-4 text-foreground">
                  <p className="text-muted-foreground">
                    Event-specific rules will be added here.
                  </p>
                  {/* TODO: Add rule book content here */}
                  <div className="border border-dashed border-border rounded-lg p-8 text-center">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Rules and guidelines for {event.name} will be published soon.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default EventDetail;
