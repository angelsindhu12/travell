export type BudgetTier = "budget" | "moderate" | "luxury";

export type TravelInterest =
  | "adventure"
  | "culture"
  | "food"
  | "nature"
  | "spiritual"
  | "beach"
  | "wildlife";

export interface TripRequest {
  destination: string;
  budget: BudgetTier;
  interests: TravelInterest[];
  travelers: number;
  preferredDays?: number;
}

export interface Activity {
  name: string;
  description: string;
  costInr: number;
  duration: string;
  category: string;
}

export interface Accommodation {
  name: string;
  type: string;
  costPerNightInr: number;
  rating: number;
  highlights: string[];
}

export interface Restaurant {
  name: string;
  cuisine: string;
  costForTwoInr: number;
  vibe: string;
}

export interface DayPlan {
  day: number;
  title: string;
  activities: Activity[];
  meals: Restaurant[];
  estimatedDayCostInr: number;
  tips: string;
}

export interface TripItinerary {
  destination: string;
  state: string;
  recommendedDays: number;
  bestTimeToVisit: string;
  budgetTier: BudgetTier;
  tagline: string;
  overview: string;
  accommodation: Accommodation;
  days: DayPlan[];
  adventureHighlights: Activity[];
  totalEstimatedCostInr: number;
  costBreakdown: {
    accommodation: number;
    activities: number;
    food: number;
    transport: number;
    misc: number;
  };
  packingTips: string[];
  localTips: string[];
}

export const BUDGET_LABELS: Record<BudgetTier, { label: string; emoji: string; description: string }> = {
  budget: {
    label: "Budget Explorer",
    emoji: "🎒",
    description: "Hostels, street food & free adventures",
  },
  moderate: {
    label: "Comfort Traveler",
    emoji: "🏨",
    description: "Mid-range hotels & curated experiences",
  },
  luxury: {
    label: "Luxury Wanderer",
    emoji: "✨",
    description: "5-star stays, fine dining & premium tours",
  },
};

export const INTEREST_OPTIONS: { id: TravelInterest; label: string; emoji: string }[] = [
  { id: "adventure", label: "Adventure", emoji: "🪂" },
  { id: "culture", label: "Culture & Heritage", emoji: "🏛️" },
  { id: "food", label: "Food & Cuisine", emoji: "🍛" },
  { id: "nature", label: "Nature & Trekking", emoji: "🏔️" },
  { id: "spiritual", label: "Spiritual", emoji: "🕉️" },
  { id: "beach", label: "Beach & Relax", emoji: "🏖️" },
  { id: "wildlife", label: "Wildlife", emoji: "🐅" },
];

export const POPULAR_DESTINATIONS = [
  { name: "Manali", emoji: "🏔️", tag: "Himachal Pradesh" },
  { name: "Goa", emoji: "🌴", tag: "Beach Paradise" },
  { name: "Jaipur", emoji: "🐘", tag: "Pink City" },
  { name: "Rishikesh", emoji: "🧘", tag: "Adventure Hub" },
  { name: "Kerala Backwaters", emoji: "🚣", tag: "God's Own Country" },
  { name: "Ladakh", emoji: "🏜️", tag: "High Altitude" },
  { name: "Varanasi", emoji: "🪔", tag: "Spiritual Capital" },
  { name: "Andaman Islands", emoji: "🐠", tag: "Tropical Escape" },
];
