import type { Metadata } from "next";

const title = "Alerts";
const description =
  "Stay ahead of fleet incidents — critical faults, low battery, overheating, and route delays in a live, actionable incident feed you can resolve in one click.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/alerts" },
  openGraph: {
    title: `${title} · EV Fleet Dashboard`,
    description,
    url: "/alerts",
    images: [{ url: "/carbanner.png", width: 600, height: 227, alt: "EV Fleet Dashboard" }],
  },
  twitter: { title: `${title} · EV Fleet Dashboard`, description, images: ["/carbanner.png"] },
};

export default function AlertsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
