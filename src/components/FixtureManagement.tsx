import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Pencil, Trash2, Plus } from "lucide-react";
import { SPORTS_EVENTS, CULTURAL_EVENTS } from "@/types/tournament";

const DIVISIONS = ["Anarchy", "Big Dawgs", "C Suite", "SPD", "Peak-e-blinders"];

interface Fixture {
  id: string;
  event_id: string;
  division_a: string;
  division_b: string;
  scheduled_date: string | null;
  scheduled_time: string | null;
  venue: string | null;
  phase: string | null;
  status: string;
  notes: string | null;
}

export default function FixtureManagement() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFixture, setEditingFixture] = useState<Fixture | null>(null);
  
  const [eventId, setEventId] = useState("");
  const [divisionA, setDivisionA] = useState("");
  const [divisionB, setDivisionB] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [venue, setVenue] = useState("");
  const [phase, setPhase] = useState("");
  const [notes, setNotes] = useState("");

  const allEvents = [...SPORTS_EVENTS, ...CULTURAL_EVENTS];

  useEffect(() => {
    fetchFixtures();
  }, []);

  const fetchFixtures = async () => {
    try {
      const { data, error } = await supabase
        .from("fixtures")
        .select("*")
        .order("scheduled_date", { ascending: true });

      if (error) throw error;
      setFixtures(data || []);
    } catch (error) {
      console.error("Error fetching fixtures:", error);
      toast.error("Failed to load fixtures");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEventId("");
    setDivisionA("");
    setDivisionB("");
    setScheduledDate("");
    setScheduledTime("");
    setVenue("");
    setPhase("");
    setNotes("");
    setEditingFixture(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventId || !divisionA || !divisionB) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (divisionA === divisionB) {
      toast.error("Division A and Division B must be different");
      return;
    }

    try {
      const fixtureData = {
        event_id: eventId,
        division_a: divisionA,
        division_b: divisionB,
        scheduled_date: scheduledDate || null,
        scheduled_time: scheduledTime || null,
        venue: venue || null,
        phase: phase || null,
        notes: notes || null,
      };

      if (editingFixture) {
        const { error } = await supabase
          .from("fixtures")
          .update(fixtureData)
          .eq("id", editingFixture.id);

        if (error) throw error;
        toast.success("Fixture updated successfully");
      } else {
        const { error } = await supabase
          .from("fixtures")
          .insert([fixtureData]);

        if (error) throw error;
        toast.success("Fixture added successfully");
      }

      resetForm();
      setIsDialogOpen(false);
      fetchFixtures();
    } catch (error) {
      console.error("Error saving fixture:", error);
      toast.error("Failed to save fixture");
    }
  };

  const handleEdit = (fixture: Fixture) => {
    setEditingFixture(fixture);
    setEventId(fixture.event_id);
    setDivisionA(fixture.division_a);
    setDivisionB(fixture.division_b);
    setScheduledDate(fixture.scheduled_date || "");
    setScheduledTime(fixture.scheduled_time || "");
    setVenue(fixture.venue || "");
    setPhase(fixture.phase || "");
    setNotes(fixture.notes || "");
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this fixture?")) return;

    try {
      const { error } = await supabase
        .from("fixtures")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Fixture deleted successfully");
      fetchFixtures();
    } catch (error) {
      console.error("Error deleting fixture:", error);
      toast.error("Failed to delete fixture");
    }
  };

  const getEventName = (eventId: string) => {
    const event = allEvents.find(e => e.id === eventId);
    return event ? event.name : eventId;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Fixture Management</CardTitle>
            <CardDescription>Schedule and manage upcoming matches</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Fixture
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingFixture ? "Edit Fixture" : "Add New Fixture"}</DialogTitle>
                <DialogDescription>
                  Schedule a new match between two divisions
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="event">Event *</Label>
                    <Select value={eventId} onValueChange={setEventId} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event" />
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

                  <div>
                    <Label htmlFor="division-a">Division A *</Label>
                    <Select value={divisionA} onValueChange={setDivisionA} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select division" />
                      </SelectTrigger>
                      <SelectContent>
                        {DIVISIONS.map((div) => (
                          <SelectItem key={div} value={div}>{div}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="division-b">Division B *</Label>
                    <Select value={divisionB} onValueChange={setDivisionB} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select division" />
                      </SelectTrigger>
                      <SelectContent>
                        {DIVISIONS.map((div) => (
                          <SelectItem key={div} value={div}>{div}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="date">Scheduled Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="time">Scheduled Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="venue">Venue</Label>
                    <Input
                      id="venue"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      placeholder="e.g., Court 1, Main Hall"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phase">Phase</Label>
                    <Input
                      id="phase"
                      value={phase}
                      onChange={(e) => setPhase(e.target.value)}
                      placeholder="e.g., Phase 1, Semi-Final"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Additional notes or instructions"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingFixture ? "Update" : "Add"} Fixture
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading fixtures...</div>
        ) : fixtures.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No fixtures scheduled yet. Click "Add Fixture" to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Match</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Phase</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fixtures.map((fixture) => (
                  <TableRow key={fixture.id}>
                    <TableCell className="font-medium">{getEventName(fixture.event_id)}</TableCell>
                    <TableCell>{fixture.division_a} vs {fixture.division_b}</TableCell>
                    <TableCell>
                      {fixture.scheduled_date && fixture.scheduled_time
                        ? `${new Date(fixture.scheduled_date).toLocaleDateString()} ${fixture.scheduled_time}`
                        : fixture.scheduled_date
                        ? new Date(fixture.scheduled_date).toLocaleDateString()
                        : "TBD"}
                    </TableCell>
                    <TableCell>{fixture.venue || "-"}</TableCell>
                    <TableCell>{fixture.phase || "-"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        fixture.status === "completed" ? "bg-green-100 text-green-800" :
                        fixture.status === "in_progress" ? "bg-blue-100 text-blue-800" :
                        fixture.status === "cancelled" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {fixture.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(fixture)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(fixture.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
