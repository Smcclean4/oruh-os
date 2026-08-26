import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- neon palette ---
        bg: "#0B0D14",
        "bg-alt": "#0F1220",
        surface: "#141827",
        "surface-2": "#1A1F32",
        line: "rgba(232,234,240,0.09)",
        magenta: "#FF2D78",
        "magenta-dim": "rgba(255,45,120,0.35)",
        cyan: "#00E5FF",
        "cyan-dim": "rgba(0,229,255,0.35)",
        amber: "#FFB627",
        text: "#E8EAF0",
        "text-dim": "#8890A4",
        "text-faint": "#565D72",

        // --- broadcast palette, namespaced under `studio` ---
        studio: {
          bg: "#0B0D12",
          panel: "#12151C",
          "panel-alt": "#0E1116",
          border: "#232733",
          red: "#FF3B4E",
          amber: "#FFB238",
          text: "#F2F0EA",
          muted: "#8890A0",
        },
      },
      fontFamily: {
        display: ["var(--font-chakra)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.25" },
        },
        floatIn: {
          "0%": { transform: "translateY(6px)", opacity: "0" },
          "15%": { transform: "translateY(0)", opacity: "1" },
          "85%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-6px)", opacity: "0" },
        },
        "tally-pulse": {
          "0%, 100%": {
            opacity: "1",
            boxShadow: "0 0 0 0 rgba(255,59,78,0.5)",
          },
          "50%": {
            opacity: "0.6",
            boxShadow: "0 0 0 6px rgba(255,59,78,0)",
          },
        },
      },
      animation: {
        blink: "blink 1.4s ease-in-out infinite",
        floatIn: "floatIn 3.6s ease-in-out infinite",
        "tally-pulse": "tally-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;