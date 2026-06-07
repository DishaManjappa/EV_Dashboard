import type { Metadata, Viewport } from "next";
import {
  Inter,
  Space_Grotesk,
  JetBrains_Mono,
  Fraunces,
  IBM_Plex_Sans,
  IBM_Plex_Mono,
  Sora,
} from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import Providers from "./providers";
import AppShell from "@/components/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_NAME = "EV Fleet Dashboard";
const SITE_DESCRIPTION =
  "Monitor your electric vehicle fleet in real time — live vehicle positions, battery health, charging network status, alerts, and energy analytics in one control room.";
const BANNER = "/carbanner.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Real-Time Fleet Intelligence`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  keywords: [
    "EV fleet management",
    "electric vehicle dashboard",
    "fleet tracking",
    "charging network",
    "battery monitoring",
    "fleet telematics",
    "EV analytics",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Real-Time Fleet Intelligence`,
    description: SITE_DESCRIPTION,
    url: "/",
    images: [
      { url: BANNER, width: 600, height: 227, alt: `${SITE_NAME} preview` },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Real-Time Fleet Intelligence`,
    description: SITE_DESCRIPTION,
    images: [BANNER],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#142210",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${fraunces.variable} ${plexSans.variable} ${plexMono.variable} ${sora.variable}`}
    >
      <body className="font-sans bg-ev-bg text-ev-text antialiased">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
