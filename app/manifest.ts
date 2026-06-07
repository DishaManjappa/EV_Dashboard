import type { MetadataRoute } from "next";

// Web app manifest — gives the dashboard an installable identity (name, theme,
// icons) and is auto-linked by Next from this file convention.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EV Fleet Dashboard",
    short_name: "EV Fleet",
    description:
      "Real-time visibility and intelligence across your electric vehicle fleet.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5EFDF",
    theme_color: "#142210",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon", type: "image/png", sizes: "180x180" },
    ],
  };
}
