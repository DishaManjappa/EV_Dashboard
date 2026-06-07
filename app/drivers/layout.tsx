import type { Metadata } from "next";

const title = "Drivers";
const description =
  "Manage your driver directory — profiles, assigned vehicles, trip history, behavior scores, shift schedules, and certifications across the fleet.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/drivers" },
  openGraph: {
    title: `${title} · EV Fleet Dashboard`,
    description,
    url: "/drivers",
    images: [{ url: "/carbanner.png", width: 600, height: 227, alt: "EV Fleet Dashboard" }],
  },
  twitter: { title: `${title} · EV Fleet Dashboard`, description, images: ["/carbanner.png"] },
};

export default function DriversLayout({ children }: { children: React.ReactNode }) {
  return children;
}
