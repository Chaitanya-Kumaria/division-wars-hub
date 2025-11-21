export type Division = "A" | "B" | "C" | "D" | "E";

export const DIVISIONS = {
  A: { name: "Anarchy", color: "hsl(270 70% 60%)" },
  B: { name: "Big Dawgs", color: "hsl(25 95% 55%)" },
  C: { name: "C Suite", color: "hsl(45 100% 51%)" },
  D: { name: "SPD", color: "hsl(210 70% 60%)" },
  E: { name: "Peak-e-blinders", color: "hsl(340 80% 60%)" },
} as const;

export interface Standings {
  division: Division;
  gold: number;
  silver: number;
  bronze: number;
  points: number;
}

export interface Fixture {
  id: string;
  eventId: string;
  division1: Division;
  division2: Division;
  date: string;
  time: string;
  venue: string;
  status: "scheduled" | "completed";
  winner?: Division;
  score?: string;
}

export interface Event {
  id: string;
  name: string;
  type: "sports" | "cultural";
  icon: string;
}

// Placeholder events - will be updated based on actual tournament
export const SPORTS_EVENTS: Event[] = [
  { id: "cricket", name: "Cricket", type: "sports", icon: "🏏" },
  { id: "football", name: "Football", type: "sports", icon: "⚽" },
  { id: "basketball", name: "Basketball", type: "sports", icon: "🏀" },
  { id: "volleyball", name: "Volleyball", type: "sports", icon: "🏐" },
  { id: "badminton", name: "Badminton", type: "sports", icon: "🏸" },
  { id: "table-tennis", name: "Table Tennis", type: "sports", icon: "🏓" },
  { id: "chess", name: "Chess", type: "sports", icon: "♟️" },
  { id: "carrom", name: "Carrom", type: "sports", icon: "🎯" },
  { id: "athletics", name: "Athletics", type: "sports", icon: "🏃" },
  { id: "swimming", name: "Swimming", type: "sports", icon: "🏊" },
  { id: "lawn-tennis", name: "Lawn Tennis", type: "sports", icon: "🎾" },
  { id: "squash", name: "Squash", type: "sports", icon: "🎾" },
  { id: "kabaddi", name: "Kabaddi", type: "sports", icon: "🤼" },
  { id: "throwball", name: "Throwball", type: "sports", icon: "🏐" },
  { id: "dodgeball", name: "Dodgeball", type: "sports", icon: "⚾" },
  { id: "relay", name: "Relay", type: "sports", icon: "🏃‍♂️" },
];

export const CULTURAL_EVENTS: Event[] = [
  { id: "dance", name: "Dance", type: "cultural", icon: "💃" },
  { id: "singing", name: "Singing", type: "cultural", icon: "🎤" },
  { id: "drama", name: "Drama", type: "cultural", icon: "🎭" },
  { id: "fashion-show", name: "Fashion Show", type: "cultural", icon: "👗" },
  { id: "standup-comedy", name: "Stand-up Comedy", type: "cultural", icon: "😄" },
  { id: "poetry", name: "Poetry", type: "cultural", icon: "📝" },
  { id: "art", name: "Art", type: "cultural", icon: "🎨" },
  { id: "quiz", name: "Quiz", type: "cultural", icon: "🧠" },
];
