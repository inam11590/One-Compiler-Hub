import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#435BFF", // Primary Electric Blue
          600: "#3649D9",
          700: "#2B3AB5",
          800: "#222D8F",
          900: "#1A236E",
        },
        accent: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#7955E8", // Secondary Accent Purple
          600: "#643FDB",
          700: "#502EBE",
          800: "#3E2394",
          900: "#2E196E",
        },
        navy: {
          950: "#070A12",
          900: "#0B0F19", // Deep Navy background
          850: "#0F1626", // Card background
          800: "#131B2E", // Border/elevated
          750: "#18223B",
          700: "#1E293B",
          600: "#334155",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 30px -5px rgba(67, 91, 255, 0.25)",
        "glow-purple": "0 0 30px -5px rgba(121, 85, 232, 0.25)",
        "card-hover": "0 10px 30px -10px rgba(67, 91, 255, 0.15)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
