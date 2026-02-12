//tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Add custom transition timing if needed
      transitionDuration: {
        '300': '300ms',
      },
      transitionTimingFunction: {
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    require("daisyui")
  ],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#3b82f6",
          "secondary": "#6366f1",
          "accent": "#f59e0b",
          "neutral": "#1f2937",
          "base-100": "#ffffff",
          "base-200": "#f3f4f6",
          "base-300": "#e5e7eb",
          "base-content": "#1f2937",
          "info": "#3b82f6",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
      {
        dark: {
          "primary": "#60a5fa",
          "secondary": "#818cf8",
          "accent": "#fbbf24",
          "neutral": "#1f2937",
          "base-100": "#1f2937",
          "base-200": "#374151",
          "base-300": "#4b5563",
          "base-content": "#e5e7eb",
          "info": "#60a5fa",
          "success": "#4ade80",
          "warning": "#fbbf24",
          "error": "#f87171",
        },
      },
    ],
    darkTheme: "dark",
  },
};