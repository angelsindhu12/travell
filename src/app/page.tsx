import TripForm from "@/components/TripForm";
import { Plane, Heart, Globe } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-hero-pattern">
      {/* Hero Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-yellow-50 to-teal-50" />
        <div className="absolute top-10 left-10 text-6xl animate-float opacity-30">🏔️</div>
        <div className="absolute top-20 right-20 text-5xl animate-float opacity-30" style={{ animationDelay: "1s" }}>🌴</div>
        <div className="absolute bottom-10 left-1/4 text-5xl animate-float opacity-30" style={{ animationDelay: "2s" }}>🪂</div>
        <div className="absolute bottom-20 right-1/3 text-4xl animate-float opacity-30" style={{ animationDelay: "0.5s" }}>🐘</div>

        <div className="relative max-w-4xl mx-auto px-4 pt-12 pb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-orange-200 text-sm font-medium text-gray-700 mb-6 shadow-sm">
            <Globe className="w-4 h-4 text-india-green" />
            Made for Incredible India 🇮🇳
          </div>

          <h1 className="font-display font-extrabold text-5xl sm:text-7xl text-gradient leading-tight">
            Travell India
          </h1>
          <p className="mt-4 text-xl sm:text-2xl text-gray-600 font-medium max-w-2xl mx-auto">
            Tell us where you dream of going — AI plans your perfect trip with adventures, stays & costs!
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { emoji: "🪂", text: "Paragliding & Rafting" },
              { emoji: "🎒", text: "Budget Hostels" },
              { emoji: "✨", text: "Luxury Resorts" },
              { emoji: "💰", text: "Full Cost Breakdown" },
            ].map((item) => (
              <span
                key={item.text}
                className="px-4 py-2 rounded-full bg-white/90 border border-orange-200 text-sm font-medium text-gray-700 shadow-sm"
              >
                {item.emoji} {item.text}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Main Form */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="glass rounded-3xl p-6 sm:p-10 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-india-coral to-saffron-500 flex items-center justify-center shadow-md">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl text-gray-800">Plan Your Adventure</h2>
              <p className="text-gray-500 text-sm">Fill in the details and let AI do the magic ✨</p>
            </div>
          </div>
          <TripForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 text-gray-500 text-sm">
        <p className="flex items-center justify-center gap-1">
          Made with <Heart className="w-4 h-4 text-india-coral fill-india-coral" /> for travelers exploring India
        </p>
        <p className="mt-1">Travell India &copy; {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}
