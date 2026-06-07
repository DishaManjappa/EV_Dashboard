import type { Metadata } from "next";

const title = "Fleet";
const description =
  "Browse every vehicle in your EV fleet — live status, battery level, location, and driver assignment — with a detail panel for any vehicle you select.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/fleet" },
  openGraph: {
    title: `${title} · EV Fleet Dashboard`,
    description,
    url: "/fleet",
    images: [{ url: "/carbanner.png", width: 600, height: 227, alt: "EV Fleet Dashboard" }],
  },
  twitter: { title: `${title} · EV Fleet Dashboard`, description, images: ["/carbanner.png"] },
};

export default function FleetLayout({ children }: { children: React.ReactNode }) {
  return children;
}
