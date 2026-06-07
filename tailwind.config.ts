import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ev: {
          bg: "#F5EFDF",
          card: "#F8F5E8",
          sidebar: "#142210",
          active: "#38583D",
          heading: "#103524",
          primary: "#315A3E",
          light: "#DCE5C8",
          muted: "#7F9B74",
          border: "#D8D0B8",
          mutedText: "#6B6B5F",
          text: "#111111",
          yellow: "#D6A534",
          lightYellow: "#F5E5B8",
          red: "#B64432",
          lightRed: "#F4D6CE",
          idle: "#A8A8A0",
          sidebarText: "#F3EEDC",
          sidebarMuted: "#A8B6A0",
          accent: "#C8E66A",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        sora: ["var(--font-sora)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        fraunces: ["var(--font-fraunces)", "Georgia", "serif"],
        plex: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
        "plex-mono": [
          "var(--font-plex-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 53, 36, 0.04), 0 1px 1px rgba(16, 53, 36, 0.02)",
        panel: "0 10px 30px rgba(16, 53, 36, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
