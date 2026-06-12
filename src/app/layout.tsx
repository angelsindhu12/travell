import type { Metadata } from "next";
import { Nunito, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Travell India — AI Travel Planner",
  description:
    "Plan your perfect India trip with AI! Get day-by-day itineraries, adventure activities, hostels or luxury hotels, and cost estimates tailored to your budget.",
  keywords: ["India travel", "itinerary planner", "budget travel India", "adventure India"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${nunito.variable} font-body bg-orange-50 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
