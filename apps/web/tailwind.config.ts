import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: "#F6F0E6", dark: "#EBE2D3" },
        forest: { DEFAULT: "#1C3D30", light: "#2F5A47", muted: "#4A6B5C" },
        gold: { DEFAULT: "#C4A574", soft: "#D8C4A0" },
        saffron: { DEFAULT: "#C49A6C", muted: "#B08968" },
        ink: { DEFAULT: "#2C2218", muted: "#5C5043" },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        deva: ["var(--font-deva)", "serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
