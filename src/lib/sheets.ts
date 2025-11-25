import { supabase } from "@/integrations/supabase/client";

export const fetchStandings = async () => {
  try {
    // Aggregate standings across all events by division
    const { data, error } = await supabase
      .from("standings")
      .select("*");

    if (error) throw error;

    // Group by division and sum points
    const divisionTotals = new Map();
    (data || []).forEach(standing => {
      const current = divisionTotals.get(standing.division) || { 
        division: standing.division, 
        gold: 0, 
        silver: 0, 
        bronze: 0, 
        points: 0 
      };
      current.points += standing.points || 0;
      divisionTotals.set(standing.division, current);
    });

    return Array.from(divisionTotals.values()).sort((a, b) => b.points - a.points);
  } catch (error) {
    console.error("Error fetching standings:", error);
    return [];
  }
};

export const fetchEventStandings = async (eventId: string) => {
  try {
    const { data, error } = await supabase
      .from("standings")
      .select("*")
      .eq("event_id", eventId)
      .order("points", { ascending: false });

    if (error) throw error;

    // Define table structure based on event type
    const tableStructure = eventId === "table-tennis"
      ? [
          { key: "division", label: "Division" },
          { key: "played", label: "Played" },
          { key: "won", label: "Won" },
          { key: "lost", label: "Lost" },
          { key: "points", label: "Points" }
        ]
      : eventId === "chess"
      ? [
          { key: "division", label: "Division" },
          { key: "played", label: "Played" },
          { key: "won", label: "Won" },
          { key: "lost", label: "Lost" },
          { key: "drawn", label: "Drawn" },
          { key: "match_points", label: "Match Points" },
          { key: "game_points", label: "Game Points" }
        ]
      : [
          { key: "division", label: "Division" },
          { key: "played", label: "Played" },
          { key: "won", label: "Won" },
          { key: "lost", label: "Lost" },
          { key: "points", label: "Points" }
        ];

    return {
      standings: data || [],
      table_structure: tableStructure
    };
  } catch (error) {
    console.error("Error fetching event standings:", error);
    return { standings: [], table_structure: [] };
  }
};

export const fetchFixtures = async (eventId: string) => {
  try {
    const { data, error } = await supabase
      .from("fixtures")
      .select("*")
      .eq("event_id", eventId)
      .order("scheduled_date", { ascending: true });

    if (error) throw error;

    // Map database format to app format
    return (data || []).map((fixture: any) => ({
      id: fixture.id,
      eventId: fixture.event_id,
      division1: fixture.division_a,
      division2: fixture.division_b,
      date: fixture.scheduled_date || "",
      time: fixture.scheduled_time || "",
      venue: fixture.venue || "",
      status: fixture.status,
      winner: undefined,
      score: undefined
    }));
  } catch (error) {
    console.error("Error fetching fixtures:", error);
    return [];
  }
};

export const updateScore = async (data: any) => {
  try {
    // This function is deprecated - use direct Supabase inserts instead
    throw new Error("Use direct database inserts for score updates");
  } catch (error) {
    console.error("Error updating score:", error);
    throw error;
  }
};

export const fetchSportsStandings = async () => {
  try {
    // Get all standings and filter for sports events
    const { data, error } = await supabase
      .from("standings")
      .select("*");

    if (error) throw error;

    // Sports event IDs - update based on your events
    const sportsEventIds = [
      "chess", "badminton", "basketball", "table-tennis", "carrom", 
      "pool", "throwball", "foosball", "volleyball", "esports-fifa", 
      "esports-valo", "box-cricket", "football", "pickleball", 
      "squash", "lawn-tennis"
    ];

    // Filter and aggregate
    const divisionTotals = new Map();
    (data || [])
      .filter(s => sportsEventIds.includes(s.event_id))
      .forEach(standing => {
        const current = divisionTotals.get(standing.division) || { 
          division: standing.division,
          points: 0 
        };
        current.points += standing.points || 0;
        divisionTotals.set(standing.division, current);
      });

    return Array.from(divisionTotals.values()).sort((a, b) => b.points - a.points);
  } catch (error) {
    console.error("Error fetching sports standings:", error);
    return [];
  }
};

export const fetchCulturalStandings = async () => {
  try {
    // Get all standings and filter for cultural events
    const { data, error } = await supabase
      .from("standings")
      .select("*");

    if (error) throw error;

    // Cultural event IDs - update based on your events
    const culturalEventIds = [
      "group-skit", "group-dance", "group-musical", "roast-comedy",
      "quiz", "rotating-art", "meme-wars", "beg-borrow-steal"
    ];

    // Filter and aggregate
    const divisionTotals = new Map();
    (data || [])
      .filter(s => culturalEventIds.includes(s.event_id))
      .forEach(standing => {
        const current = divisionTotals.get(standing.division) || { 
          division: standing.division,
          points: 0 
        };
        current.points += standing.points || 0;
        divisionTotals.set(standing.division, current);
      });

    return Array.from(divisionTotals.values()).sort((a, b) => b.points - a.points);
  } catch (error) {
    console.error("Error fetching cultural standings:", error);
    return [];
  }
};

export const fetchEventRules = async (eventId: string) => {
  try {
    // For now, return placeholder text
    // In future, store rules in database or markdown files
    return `Rules for ${eventId} will be published soon.`;
  } catch (error) {
    console.error("Error fetching event rules:", error);
    return "Rules will be updated soon.";
  }
};
