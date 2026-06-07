import type { Metadata } from "next";

const title = "Charging";
const description =
  "Monitor the charging network in real time — station load, vehicles charging now, and a live map of every vehicle and charger across the service area.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/charging" },
  openGraph: {
    title: `${title} · EV Fleet Dashboard`,
    description,
    url: "/charging",
    images: [{ url: "/carbanner.png", width: 600, height: 227, alt: "EV Fleet Dashboard" }],
  },
  twitter: { title: `${title} · EV Fleet Dashboard`, description, images: ["/carbanner.png"] },
};

export default function ChargingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
