"use client";

import { useState } from "react";
import {
  MapPin,
  Sparkles,
  Users,
  Calendar,
  IndianRupee,
  Loader2,
  Plane,
  Compass,
} from "lucide-react";
import {
  BUDGET_LABELS,
  INTEREST_OPTIONS,
  POPULAR_DESTINATIONS,
  type BudgetTier,
  type TravelInterest,
  type TripItinerary,
} from "@/types/travel";
import ItineraryDisplay from "@/components/ItineraryDisplay";

export default function TripForm() {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState<BudgetTier>("moderate");
  const [interests, setInterests] = useState<TravelInterest[]>([]);
  const [travelers, setTravelers] = useState(2);
  const [preferredDays, setPreferredDays] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [itinerary, setItinerary] = useState<TripItinerary | null>(null);
  const [source, setSource] = useState<"ai" | "curated" | null>(null);

  const toggleInterest = (id: TravelInterest) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      setError("Please enter a destination in India!");
      return;
    }

    setLoading(true);
    setError("");
    setItinerary(null);

    try {
      const res = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: destination.trim(),
          budget,
          interests,
          travelers,
          preferredDays: preferredDays || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setItinerary(data.itinerary);
      setSource(data.source);
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate itinerary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Destination */}
        <div>
          <label className="flex items-center gap-2 text-lg font-display font-semibold text-gray-800 mb-3">
            <MapPin className="w-5 h-5 text-india-coral" />
            Where in India do you want to go?
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. Manali, Goa, Jaipur, Rishikesh..."
            className="w-full px-5 py-4 rounded-2xl border-2 border-orange-200 focus:border-india-coral focus:ring-4 focus:ring-orange-100 outline-none text-lg transition-all bg-white"
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {POPULAR_DESTINATIONS.map((d) => (
              <button
                key={d.name}
                type="button"
                onClick={() => setDestination(d.name)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all card-hover ${
                  destination === d.name
                    ? "bg-gradient-to-r from-india-coral to-saffron-500 text-white shadow-md"
                    : "bg-white border border-orange-200 text-gray-700 hover:border-india-coral"
                }`}
              >
                {d.emoji} {d.name}
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="flex items-center gap-2 text-lg font-display font-semibold text-gray-800 mb-3">
            <IndianRupee className="w-5 h-5 text-india-teal" />
            What&apos;s your budget style?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(Object.entries(BUDGET_LABELS) as [BudgetTier, typeof BUDGET_LABELS.budget][]).map(
              ([key, val]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setBudget(key)}
                  className={`p-5 rounded-2xl border-2 text-left transition-all card-hover ${
                    budget === key
                      ? key === "budget"
                        ? "border-india-teal bg-teal-50 shadow-lg ring-2 ring-india-teal/30"
                        : key === "moderate"
                          ? "border-saffron-400 bg-orange-50 shadow-lg ring-2 ring-saffron-400/30"
                          : "border-india-purple bg-purple-50 shadow-lg ring-2 ring-india-purple/30"
                      : "border-orange-200 bg-white hover:border-orange-300"
                  }`}
                >
                  <span className="text-3xl">{val.emoji}</span>
                  <p className="font-display font-bold text-gray-800 mt-2">{val.label}</p>
                  <p className="text-sm text-gray-500 mt-1">{val.description}</p>
                </button>
              )
            )}
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="flex items-center gap-2 text-lg font-display font-semibold text-gray-800 mb-3">
            <Compass className="w-5 h-5 text-india-purple" />
            What excites you?
          </label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggleInterest(opt.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all card-hover ${
                  interests.includes(opt.id)
                    ? "bg-gradient-to-r from-india-purple to-india-coral text-white shadow-md"
                    : "bg-white border border-orange-200 text-gray-700 hover:border-india-purple"
                }`}
              >
                {opt.emoji} {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Travelers & Days */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-lg font-display font-semibold text-gray-800 mb-3">
              <Users className="w-5 h-5 text-saffron-500" />
              Travelers
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setTravelers(Math.max(1, travelers - 1))}
                className="w-12 h-12 rounded-xl bg-white border-2 border-orange-200 text-xl font-bold hover:border-india-coral transition-colors"
              >
                −
              </button>
              <span className="text-3xl font-display font-bold text-gray-800 w-12 text-center">
                {travelers}
              </span>
              <button
                type="button"
                onClick={() => setTravelers(Math.min(10, travelers + 1))}
                className="w-12 h-12 rounded-xl bg-white border-2 border-orange-200 text-xl font-bold hover:border-india-coral transition-colors"
              >
                +
              </button>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-lg font-display font-semibold text-gray-800 mb-3">
              <Calendar className="w-5 h-5 text-india-gold" />
              Days (optional)
            </label>
            <input
              type="number"
              min={1}
              max={21}
              value={preferredDays}
              onChange={(e) => setPreferredDays(e.target.value ? Number(e.target.value) : "")}
              placeholder="AI will suggest if empty"
              className="w-full px-5 py-3 rounded-2xl border-2 border-orange-200 focus:border-india-gold focus:ring-4 focus:ring-yellow-100 outline-none transition-all bg-white"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-5 rounded-2xl bg-gradient-to-r from-india-coral via-saffron-500 to-india-gold text-white font-display font-bold text-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Crafting your adventure...
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6" />
              Generate My India Itinerary
            </>
          )}
        </button>
      </form>

      {itinerary && (
        <div id="results" className="mt-16">
          <ItineraryDisplay itinerary={itinerary} source={source} />
        </div>
      )}
    </>
  );
}
