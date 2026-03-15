/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
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
      animation: {
        fadeIn: "fadeIn 0.2s ease-out",
        scaleIn: "scaleIn 0.2s ease-out",
        ripple: "ripple 1000ms linear forwards",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
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
  plugins: [],
};