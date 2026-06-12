import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { generateFallbackItinerary } from "@/lib/fallback-itinerary";
import type { BudgetTier, TripItinerary, TripRequest, TravelInterest } from "@/types/travel";

const SYSTEM_PROMPT = `You are Travell India, an expert Indian travel planner. Create detailed, realistic travel itineraries ONLY for destinations in India.

Always respond with valid JSON matching this exact structure:
{
  "destination": "string",
  "state": "string",
  "recommendedDays": number,
  "bestTimeToVisit": "string",
  "budgetTier": "budget" | "moderate" | "luxury",
  "tagline": "string (fun, emoji-friendly)",
  "overview": "string (2-3 sentences)",
  "accommodation": {
    "name": "string (real or realistic hotel/hostel name)",
    "type": "string",
    "costPerNightInr": number,
    "rating": number,
    "highlights": ["string"]
  },
  "days": [{
    "day": number,
    "title": "string",
    "activities": [{
      "name": "string",
      "description": "string",
      "costInr": number,
      "duration": "string",
      "category": "string"
    }],
    "meals": [{
      "name": "string",
      "cuisine": "string",
      "costForTwoInr": number,
      "vibe": "string"
    }],
    "estimatedDayCostInr": number,
    "tips": "string"
  }],
  "adventureHighlights": [{
    "name": "string",
    "description": "string",
    "costInr": number,
    "duration": "string",
    "category": "string"
  }],
  "totalEstimatedCostInr": number,
  "costBreakdown": {
    "accommodation": number,
    "activities": number,
    "food": number,
    "transport": number,
    "misc": number
  },
  "packingTips": ["string"],
  "localTips": ["string"]
}

Budget rules:
- budget: Hostels (Zostel, goSTOPS), dhabas, street food, public transport. Total ~₹3,000-8,000/person/day
- moderate: 3-star hotels, mid-range restaurants, guided tours. Total ~₹8,000-15,000/person/day  
- luxury: 5-star resorts (Taj, Oberoi, ITC), fine dining, private tours. Total ~₹20,000-50,000/person/day

Include real adventure activities where applicable: paragliding, rafting, scuba, trekking, wildlife safaris, etc.
Use realistic INR prices for 2025-2026. All destinations must be in India.`;

function parseRequest(body: unknown): TripRequest | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const destination = typeof b.destination === "string" ? b.destination.trim() : "";
  const budget = b.budget as BudgetTier;
  const interests = Array.isArray(b.interests) ? (b.interests as TravelInterest[]) : [];
  const travelers = typeof b.travelers === "number" ? b.travelers : 1;
  const preferredDays = typeof b.preferredDays === "number" ? b.preferredDays : undefined;

  if (!destination || !["budget", "moderate", "luxury"].includes(budget)) return null;
  return { destination, budget, interests, travelers, preferredDays };
}

export async function POST(request: NextRequest) {
  let tripRequest: TripRequest | null = null;

  try {
    const body = await request.json();
    tripRequest = parseRequest(body);

    if (!tripRequest) {
      return NextResponse.json({ error: "Invalid request. Please provide destination and budget." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey === "your_openai_api_key_here") {
      const itinerary = generateFallbackItinerary(tripRequest);
      return NextResponse.json({ itinerary, source: "curated" });
    }

    const openai = new OpenAI({ apiKey });

    const userPrompt = `Plan a trip to ${tripRequest.destination}, India.
Budget tier: ${tripRequest.budget}
Number of travelers: ${tripRequest.travelers}
Interests: ${tripRequest.interests.join(", ") || "general sightseeing"}
${tripRequest.preferredDays ? `Preferred duration: ${tripRequest.preferredDays} days` : "Choose optimal number of days"}

Create a complete itinerary with day-by-day plans, accommodation matching the budget tier, adventure activities (paragliding, rafting, etc. where available), restaurants, and accurate cost estimates in INR.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("Empty AI response");

    const itinerary = JSON.parse(content) as TripItinerary;
    itinerary.budgetTier = tripRequest.budget;

    return NextResponse.json({ itinerary, source: "ai" });
  } catch (error) {
    console.error("Itinerary generation error:", error);

    if (tripRequest) {
      const itinerary = generateFallbackItinerary(tripRequest);
      return NextResponse.json({ itinerary, source: "curated" });
    }

    return NextResponse.json({ error: "Failed to generate itinerary. Please try again." }, { status: 500 });
  }
}
