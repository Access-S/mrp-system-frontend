/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // --- 1. NEW SHADCN COLORS ---
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },

        // --- 2. YOUR LEGACY CUSTOM COLORS (Preserved!) ---
        themed: {
          "bg-primary": "rgb(var(--color-bg-primary) / <alpha-value>)",
          "bg-secondary": "rgb(var(--color-bg-secondary) / <alpha-value>)",
          card: "rgb(var(--color-card) / <alpha-value>)",
          "card-hover": "rgb(var(--color-card-hover) / <alpha-value>)",
          "table-header": "rgb(var(--color-table-header) / <alpha-value>)",
          border: "rgb(var(--color-border) / <alpha-value>)",
          "text-primary": "rgb(var(--color-text-primary) / <alpha-value>)",
          "text-secondary": "rgb(var(--color-text-secondary) / <alpha-value>)",
          "text-muted": "rgb(var(--color-text-muted) / <alpha-value>)",
          "sidebar-text": "rgb(var(--color-sidebar-text) / <alpha-value>)",
          navbar: "rgb(var(--color-navbar) / <alpha-value>)",
          "navbar-border": "rgb(var(--color-navbar-border) / <alpha-value>)",
          "active-row": "rgb(var(--color-active-row) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        // Your custom animations
        fadeIn: "fadeIn 0.2s ease-out",
        scaleIn: "scaleIn 0.2s ease-out",
        ripple: "ripple 1000ms linear forwards",
        shimmer: "shimmer 1.5s infinite",
        // Shadcn default animations
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        // Your custom keyframes
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "0.4" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        // Shadcn default keyframes
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      height: {
        modal: "28rem",
        "modal-lg": "60vh",
      },
      minWidth: {
        input: "200px",
        table: "640px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};