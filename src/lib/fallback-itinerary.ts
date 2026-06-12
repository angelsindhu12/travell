import type { BudgetTier, TripItinerary, TripRequest } from "@/types/travel";

function getBudgetMultiplier(budget: BudgetTier): number {
  switch (budget) {
    case "budget":
      return 1;
    case "moderate":
      return 2.2;
    case "luxury":
      return 4.5;
  }
}

function getAccommodation(budget: BudgetTier, destination: string) {
  const base = destination.toLowerCase();
  const mult = getBudgetMultiplier(budget);

  if (budget === "budget") {
    return {
      name: `Zostel ${destination.split(" ")[0]} / goSTOPS`,
      type: "Hostel (Shared Dorm)",
      costPerNightInr: Math.round(400 * mult),
      rating: 4.2,
      highlights: ["Rooftop common area", "Backpacker community", "Free walking tours", "Lockers & WiFi"],
    };
  }
  if (budget === "moderate") {
    return {
      name: `Treebo / FabHotel ${destination.split(" ")[0]}`,
      type: "3-Star Hotel",
      costPerNightInr: Math.round(2500 * mult),
      rating: 4.4,
      highlights: ["AC rooms", "Complimentary breakfast", "Central location", "24/7 reception"],
    };
  }
  return {
    name: `Taj / Oberoi ${destination.split(" ")[0]} Collection`,
    type: "5-Star Luxury Resort",
    costPerNightInr: Math.round(12000 * mult),
    rating: 4.9,
    highlights: ["Spa & infinity pool", "Private butler", "Fine dining on-site", "Heritage architecture"],
  };
}

function getAdventures(budget: BudgetTier, destination: string) {
  const dest = destination.toLowerCase();
  const mult = getBudgetMultiplier(budget);

  const adventures: Record<string, { name: string; desc: string; base: number; dur: string; cat: string }[]> = {
    manali: [
      { name: "Paragliding in Solang Valley", desc: "Soar over snow-capped peaks with certified pilots", base: 2500, dur: "15-20 min", cat: "adventure" },
      { name: "River Rafting on Beas", desc: "Grade II-III rapids through Kullu valley", base: 800, dur: "2 hrs", cat: "adventure" },
      { name: "Hampta Pass Trek", desc: "Moderate trek through alpine meadows", base: 4500, dur: "4 days", cat: "nature" },
    ],
    goa: [
      { name: "Scuba Diving at Grande Island", desc: "Explore coral reefs and tropical fish", base: 3500, dur: "4 hrs", cat: "adventure" },
      { name: "Parasailing at Calangute", desc: "Fly over the Arabian Sea coastline", base: 1500, dur: "10 min", cat: "adventure" },
      { name: "Dudhsagar Falls Jeep Safari", desc: "Off-road adventure to India's tallest waterfall", base: 2200, dur: "Full day", cat: "nature" },
    ],
    rishikesh: [
      { name: "White Water Rafting", desc: "16km stretch with thrilling rapids", base: 600, dur: "2 hrs", cat: "adventure" },
      { name: "Bungee Jumping", desc: "India's highest bungee at 83 meters", base: 3500, dur: "30 min", cat: "adventure" },
      { name: "Ganga Aarti at Triveni Ghat", desc: "Spiritual evening ceremony by the Ganges", base: 0, dur: "1 hr", cat: "spiritual" },
    ],
    ladakh: [
      { name: "Pangong Lake Day Trip", desc: "Iconic blue lake at 4,350m altitude", base: 3500, dur: "Full day", cat: "nature" },
      { name: "Khardung La Pass Ride", desc: "World's highest motorable pass on bike", base: 2000, dur: "Full day", cat: "adventure" },
      { name: "Camel Safari in Nubra", desc: "Double-humped camels in sand dunes", base: 500, dur: "1 hr", cat: "adventure" },
    ],
    default: [
      { name: "Heritage Walking Tour", desc: "Explore local history with a guide", base: 500, dur: "3 hrs", cat: "culture" },
      { name: "Local Food Trail", desc: "Taste authentic regional cuisine", base: 800, dur: "4 hrs", cat: "food" },
      { name: "Sunset Viewpoint Trek", desc: "Short hike to panoramic views", base: 300, dur: "2 hrs", cat: "nature" },
    ],
  };

  const key = Object.keys(adventures).find((k) => dest.includes(k)) || "default";
  return adventures[key].map((a) => ({
    name: a.name,
    description: a.desc,
    costInr: Math.round(a.base * (budget === "luxury" ? 1.8 : budget === "moderate" ? 1.3 : 1)),
    duration: a.dur,
    category: a.cat,
  }));
}

function getRestaurants(budget: BudgetTier, destination: string) {
  if (budget === "budget") {
    return [
      { name: "Local Dhaba / Street Stalls", cuisine: "Regional Thali", costForTwoInr: 200, vibe: "Authentic & budget-friendly" },
      { name: "Cafe 1947 / Local Backpacker Cafe", cuisine: "Continental & Indian", costForTwoInr: 400, vibe: "Chill vibes, great coffee" },
    ];
  }
  if (budget === "moderate") {
    return [
      { name: "Indian Accent / Local Fine Dining", cuisine: "Modern Indian", costForTwoInr: 2500, vibe: "Elegant ambiance" },
      { name: "Regional Specialty Restaurant", cuisine: "Local Cuisine", costForTwoInr: 1200, vibe: "Cultural dining experience" },
    ];
  }
  return [
    { name: "Taj Mahal Restaurant / Oberoi Dining", cuisine: "Fine Indian & Continental", costForTwoInr: 8000, vibe: "Michelin-level experience" },
    { name: "Rooftop Premium Lounge", cuisine: "Fusion & Cocktails", costForTwoInr: 5000, vibe: "Skyline views & luxury" },
  ];
}

function getState(destination: string): string {
  const map: Record<string, string> = {
    manali: "Himachal Pradesh",
    goa: "Goa",
    jaipur: "Rajasthan",
    rishikesh: "Uttarakhand",
    kerala: "Kerala",
    ladakh: "Ladakh",
    varanasi: "Uttar Pradesh",
    andaman: "Andaman & Nicobar",
    mumbai: "Maharashtra",
    delhi: "Delhi",
    udaipur: "Rajasthan",
    shimla: "Himachal Pradesh",
  };
  const key = Object.keys(map).find((k) => destination.toLowerCase().includes(k));
  return key ? map[key] : "India";
}

function getBestTime(destination: string): string {
  const dest = destination.toLowerCase();
  if (dest.includes("ladakh") || dest.includes("manali") || dest.includes("shimla"))
    return "May to October (avoid monsoon & extreme winter)";
  if (dest.includes("goa") || dest.includes("andaman") || dest.includes("kerala"))
    return "October to March (pleasant weather)";
  if (dest.includes("rajasthan") || dest.includes("jaipur") || dest.includes("udaipur"))
    return "November to February (cool & festive season)";
  return "October to March (generally ideal across India)";
}

export function generateFallbackItinerary(request: TripRequest): TripItinerary {
  const { destination, budget, travelers, preferredDays } = request;
  const days = preferredDays || (budget === "luxury" ? 5 : budget === "moderate" ? 4 : 3);
  const accommodation = getAccommodation(budget, destination);
  const adventures = getAdventures(budget, destination);
  const restaurants = getRestaurants(budget, destination);
  const state = getState(destination);

  const dayPlans = Array.from({ length: days }, (_, i) => {
    const dayNum = i + 1;
    const activity = adventures[i % adventures.length];
    const meal = restaurants[i % restaurants.length];
    const dayCost =
      (i === 0 ? 0 : activity.costInr) +
      meal.costForTwoInr +
      (i === 0 ? accommodation.costPerNightInr : 0);

    const titles = [
      `Arrival & Local Exploration`,
      `Adventure Day — ${activity.name.split(" ")[0]} Thrills`,
      `Culture & Hidden Gems`,
      `Nature & Scenic Beauty`,
      `Farewell & Souvenir Hunt`,
    ];

    return {
      day: dayNum,
      title: titles[i] || `Day ${dayNum} Discovery`,
      activities: [
        activity,
        ...(dayNum === 1
          ? [{ name: "Check-in & Rest", description: "Settle in and explore nearby markets", costInr: 0, duration: "2 hrs", category: "relax" }]
          : []),
      ],
      meals: [meal],
      estimatedDayCostInr: Math.round(dayCost * travelers),
      tips:
        dayNum === 1
          ? "Carry cash for local vendors. Bargain politely at markets!"
          : "Start early to beat crowds. Stay hydrated!",
    };
  });

  const accommodationTotal = accommodation.costPerNightInr * (days - 1) * travelers;
  const activitiesTotal = adventures.reduce((s, a) => s + a.costInr, 0) * travelers;
  const foodTotal = restaurants.reduce((s, r) => s + r.costForTwoInr, 0) * Math.ceil(days / 2) * Math.ceil(travelers / 2);
  const transportTotal = budget === "budget" ? 1500 * travelers : budget === "moderate" ? 4000 * travelers : 12000 * travelers;
  const miscTotal = budget === "budget" ? 500 * days : budget === "moderate" ? 1500 * days : 5000 * days;

  const total = accommodationTotal + activitiesTotal + foodTotal + transportTotal + miscTotal;

  const taglines: Record<BudgetTier, string> = {
    budget: `Epic ${destination} adventure without breaking the bank! 🎒`,
    moderate: `The perfect balance of comfort & discovery in ${destination} 🌟`,
    luxury: `Indulge in the finest ${destination} has to offer ✨`,
  };

  return {
    destination,
    state,
    recommendedDays: days,
    bestTimeToVisit: getBestTime(destination),
    budgetTier: budget,
    tagline: taglines[budget],
    overview: `Discover the magic of ${destination}, ${state}! This ${days}-day ${budget} itinerary is crafted for ${travelers} traveler${travelers > 1 ? "s" : ""}, packed with adventures, local flavors, and unforgettable moments across incredible India.`,
    accommodation,
    days: dayPlans,
    adventureHighlights: adventures,
    totalEstimatedCostInr: Math.round(total),
    costBreakdown: {
      accommodation: Math.round(accommodationTotal),
      activities: Math.round(activitiesTotal),
      food: Math.round(foodTotal),
      transport: Math.round(transportTotal),
      misc: Math.round(miscTotal),
    },
    packingTips: [
      "Comfortable walking shoes are a must!",
      budget === "luxury" ? "Pack smart casual for fine dining" : "Light layers — Indian weather varies!",
      "Sunscreen, reusable water bottle & power bank",
      destination.toLowerCase().includes("ladakh") || destination.toLowerCase().includes("manali")
        ? "Warm jacket — mountains get cold!"
        : "Umbrella or raincoat during monsoon season",
    ],
    localTips: [
      "Download offline maps — signal can be spotty in remote areas",
      "Use UPI payments (PhonePe/GPay) — widely accepted in India",
      "Respect local customs at temples and sacred sites",
      "Try the local chai — it's an experience in itself! ☕",
    ],
  };
}
