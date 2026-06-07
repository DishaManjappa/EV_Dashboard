import type { Metadata } from "next";

const title = "Settings";
const description =
  "Configure your workspace — account and security, notification channels, status rule engine, team access, API keys, and audit history for fleet operations.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/settings" },
  openGraph: {
    title: `${title} · EV Fleet Dashboard`,
    description,
    url: "/settings",
    images: [{ url: "/carbanner.png", width: 600, height: 227, alt: "EV Fleet Dashboard" }],
  },
  twitter: { title: `${title} · EV Fleet Dashboard`, description, images: ["/carbanner.png"] },
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
