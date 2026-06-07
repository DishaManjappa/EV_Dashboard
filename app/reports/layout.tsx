import type { Metadata } from "next";

const title = "Reports";
const description =
  "Analyze fleet performance — power usage, CO₂ saved, charging cost, utilization, and monthly mileage by vehicle class — with exportable energy analytics.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/reports" },
  openGraph: {
    title: `${title} · EV Fleet Dashboard`,
    description,
    url: "/reports",
    images: [{ url: "/carbanner.png", width: 600, height: 227, alt: "EV Fleet Dashboard" }],
  },
  twitter: { title: `${title} · EV Fleet Dashboard`, description, images: ["/carbanner.png"] },
};

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
