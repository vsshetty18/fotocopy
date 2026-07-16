// ====================================================
// Tailwind CSS Configuration
// Defines the dark/light theme color system using CSS
// variables (set in globals.css), so ThemeToggle can
// switch themes instantly without a page reload.
// ====================================================

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // toggled via a "dark" class on <html>, controlled by ThemeToggle
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic color names mapped to CSS variables —
        // components use e.g. bg-background, bg-card, text-foreground
        // and never hardcode hex values or "dark:" variants directly.
        background: "var(--color-background)",
        card: "var(--color-card)",
        foreground: "var(--color-foreground)",
        primary: "var(--color-primary)",
        "primary-foreground": "var(--color-primary-foreground)",
        border: "var(--color-border)",
        muted: "var(--color-muted)",
      },
      borderRadius: {
        card: "16px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(0, 0, 0, 0.06)",
        "card-dark": "0 2px 12px rgba(0, 0, 0, 0.3)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
