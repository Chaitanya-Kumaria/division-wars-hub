import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SPORTS_EVENTS, CULTURAL_EVENTS } from "@/types/tournament";
import { useToast } from "@/hooks/use-toast";
import { isAuthenticated } from "@/lib/auth";
import { ArrowLeft, PlusCircle } from "lucide-react";
import MatchEntryForm from "@/components/MatchEntryForm";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState("");

  if (!isAuthenticated()) {
    navigate("/auth");
    return null;
  }

  const allEvents = [...SPORTS_EVENTS, ...CULTURAL_EVENTS];
  const selectedEventData = allEvents.find(e => e.id === selectedEvent);

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
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Select Event</CardTitle>
                  <CardDescription>
                    Choose an event to record match results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                      <SelectTrigger>
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
                </CardContent>
              </Card>

              {selectedEvent && selectedEventData && (
                <MatchEntryForm 
                  eventId={selectedEvent}
                  eventName={selectedEventData.name}
                />
              )}
            </div>
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
