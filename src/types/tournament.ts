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

export const SPORTS_EVENTS: Event[] = [
  { id: "chess", name: "Chess", type: "sports", icon: "♟️" },
  { id: "badminton", name: "Badminton", type: "sports", icon: "🏸" },
  { id: "basketball", name: "Basketball", type: "sports", icon: "🏀" },
  { id: "table-tennis", name: "Table Tennis", type: "sports", icon: "🏓" },
  { id: "carrom", name: "Carrom", type: "sports", icon: "🎯" },
  { id: "pool", name: "Pool", type: "sports", icon: "🎱" },
  { id: "throwball", name: "Throwball", type: "sports", icon: "🏐" },
  { id: "foosball", name: "Foosball", type: "sports", icon: "⚽" },
  { id: "volleyball", name: "Volleyball", type: "sports", icon: "🏐" },
  { id: "esports-fifa", name: "E-Sports FIFA", type: "sports", icon: "🎮" },
  { id: "esports-valo", name: "E-Sports Valo", type: "sports", icon: "🎮" },
  { id: "box-cricket", name: "Box Cricket", type: "sports", icon: "🏏" },
  { id: "football", name: "Football", type: "sports", icon: "⚽" },
  { id: "pickleball", name: "Pickleball", type: "sports", icon: "🏸" },
  { id: "squash", name: "Squash", type: "sports", icon: "🎾" },
  { id: "lawn-tennis", name: "Lawn Tennis", type: "sports", icon: "🎾" },
];

export const CULTURAL_EVENTS: Event[] = [
  { id: "group-skit", name: "Group Skit", type: "cultural", icon: "🎭" },
  { id: "group-dance", name: "Group Dance", type: "cultural", icon: "💃" },
  { id: "group-musical", name: "Group Musical", type: "cultural", icon: "🎵" },
  { id: "roast-comedy", name: "Roast Comedy", type: "cultural", icon: "🎤" },
  { id: "quiz", name: "Quiz", type: "cultural", icon: "🧠" },
  { id: "rotating-art", name: "Rotating Art", type: "cultural", icon: "🎨" },
  { id: "meme-wars", name: "Meme Wars", type: "cultural", icon: "😂" },
  { id: "beg-borrow-steal", name: "Beg, Borrow, Steal", type: "cultural", icon: "🔍" },
];
