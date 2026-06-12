"use client";

import {
  Calendar,
  MapPin,
  Star,
  IndianRupee,
  Lightbulb,
  Backpack,
  Utensils,
  Car,
  Sparkles,
  Mountain,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { BUDGET_LABELS, type TripItinerary } from "@/types/travel";

function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

interface Props {
  itinerary: TripItinerary;
  source: "ai" | "curated" | null;
}

export default function ItineraryDisplay({ itinerary, source }: Props) {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const budgetInfo = BUDGET_LABELS[itinerary.budgetTier];

  const costItems = [
    { label: "Stay", amount: itinerary.costBreakdown.accommodation, icon: Backpack, color: "text-india-teal" },
    { label: "Activities", amount: itinerary.costBreakdown.activities, icon: Mountain, color: "text-india-coral" },
    { label: "Food", amount: itinerary.costBreakdown.food, icon: Utensils, color: "text-saffron-500" },
    { label: "Transport", amount: itinerary.costBreakdown.transport, icon: Car, color: "text-india-purple" },
    { label: "Misc", amount: itinerary.costBreakdown.misc, icon: Sparkles, color: "text-india-gold" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-india-coral via-saffron-500 to-india-gold p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-white/20 text-sm font-medium backdrop-blur-sm">
              {budgetInfo.emoji} {budgetInfo.label}
            </span>
            {source && (
              <span className="px-3 py-1 rounded-full bg-white/20 text-sm font-medium backdrop-blur-sm">
                {source === "ai" ? "🤖 AI Generated" : "📋 Curated Plan"}
              </span>
            )}
          </div>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl mb-2">
            {itinerary.destination}
          </h2>
          <p className="text-white/90 text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5" /> {itinerary.state}, India
          </p>
          <p className="mt-4 text-xl font-medium">{itinerary.tagline}</p>
          <p className="mt-3 text-white/80 max-w-2xl">{itinerary.overview}</p>

          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">{itinerary.recommendedDays} Days</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>Best: {itinerary.bestTimeToVisit}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Total Cost */}
      <div className="glass rounded-3xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-gray-500 font-medium">Estimated Total Cost</p>
            <p className="text-4xl font-display font-extrabold text-gradient">
              {formatInr(itinerary.totalEstimatedCostInr)}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {costItems.map((item) => (
              <div key={item.label} className="text-center p-3 rounded-xl bg-orange-50">
                <item.icon className={`w-5 h-5 mx-auto ${item.color}`} />
                <p className="text-xs text-gray-500 mt-1">{item.label}</p>
                <p className="font-bold text-sm text-gray-800">{formatInr(item.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Accommodation */}
      <div className="glass rounded-3xl p-6 shadow-lg card-hover">
        <h3 className="font-display font-bold text-2xl text-gray-800 mb-4 flex items-center gap-2">
          {itinerary.budgetTier === "budget" ? "🎒" : itinerary.budgetTier === "luxury" ? "✨" : "🏨"}
          Where You&apos;ll Stay
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex-1">
            <p className="font-bold text-xl text-gray-800">{itinerary.accommodation.name}</p>
            <p className="text-gray-500">{itinerary.accommodation.type}</p>
            <div className="flex items-center gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(itinerary.accommodation.rating)
                      ? "text-india-gold fill-india-gold"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-1">{itinerary.accommodation.rating}</span>
            </div>
            <ul className="mt-3 space-y-1">
              {itinerary.accommodation.highlights.map((h) => (
                <li key={h} className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="text-india-teal">✓</span> {h}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-india-teal">
              {formatInr(itinerary.accommodation.costPerNightInr)}
            </p>
            <p className="text-sm text-gray-500">per night</p>
          </div>
        </div>
      </div>

      {/* Adventure Highlights */}
      <div>
        <h3 className="font-display font-bold text-2xl text-gray-800 mb-4">
          🪂 Adventure & Activities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {itinerary.adventureHighlights.map((activity) => (
            <div
              key={activity.name}
              className="glass rounded-2xl p-5 shadow-md card-hover border-l-4 border-india-coral"
            >
              <p className="font-bold text-gray-800">{activity.name}</p>
              <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700 capitalize">
                  {activity.category}
                </span>
                <span className="text-sm text-gray-500">{activity.duration}</span>
              </div>
              <p className="font-bold text-india-coral mt-2 flex items-center gap-1">
                <IndianRupee className="w-4 h-4" />
                {formatInr(activity.costInr)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Day by Day */}
      <div>
        <h3 className="font-display font-bold text-2xl text-gray-800 mb-4">
          📅 Day-by-Day Plan
        </h3>
        <div className="space-y-3">
          {itinerary.days.map((day) => {
            const isOpen = expandedDay === day.day;
            return (
              <div
                key={day.day}
                className="glass rounded-2xl shadow-md overflow-hidden"
              >
                <button
                  onClick={() => setExpandedDay(isOpen ? null : day.day)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-orange-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-india-coral to-saffron-500 text-white font-display font-bold text-lg flex items-center justify-center shadow-md">
                      {day.day}
                    </span>
                    <div>
                      <p className="font-display font-bold text-gray-800">{day.title}</p>
                      <p className="text-sm text-gray-500">
                        Est. {formatInr(day.estimatedDayCostInr)}
                      </p>
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 space-y-4 border-t border-orange-100">
                    <div>
                      <p className="font-semibold text-gray-700 mt-4 mb-2">Activities</p>
                      {day.activities.map((act) => (
                        <div
                          key={act.name}
                          className="flex items-start justify-between py-2 border-b border-orange-50 last:border-0"
                        >
                          <div>
                            <p className="font-medium text-gray-800">{act.name}</p>
                            <p className="text-sm text-gray-500">{act.description}</p>
                            <p className="text-xs text-gray-400 mt-1">{act.duration}</p>
                          </div>
                          <p className="font-semibold text-india-coral whitespace-nowrap ml-4">
                            {act.costInr === 0 ? "Free" : formatInr(act.costInr)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-700 mb-2">🍽️ Where to Eat</p>
                      {day.meals.map((meal) => (
                        <div
                          key={meal.name}
                          className="flex items-start justify-between py-2 border-b border-orange-50 last:border-0"
                        >
                          <div>
                            <p className="font-medium text-gray-800">{meal.name}</p>
                            <p className="text-sm text-gray-500">
                              {meal.cuisine} · {meal.vibe}
                            </p>
                          </div>
                          <p className="font-semibold text-saffron-600 whitespace-nowrap ml-4">
                            {formatInr(meal.costForTwoInr)} / 2
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-start gap-2 p-3 rounded-xl bg-yellow-50 border border-yellow-200">
                      <Lightbulb className="w-5 h-5 text-india-gold shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700">{day.tips}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6 shadow-md">
          <h4 className="font-display font-bold text-lg text-gray-800 mb-3">🎒 Packing Tips</h4>
          <ul className="space-y-2">
            {itinerary.packingTips.map((tip) => (
              <li key={tip} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-india-teal mt-0.5">•</span> {tip}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-2xl p-6 shadow-md">
          <h4 className="font-display font-bold text-lg text-gray-800 mb-3">🇮🇳 Local Tips</h4>
          <ul className="space-y-2">
            {itinerary.localTips.map((tip) => (
              <li key={tip} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-india-coral mt-0.5">•</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
