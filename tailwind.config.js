const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#3b82f6",          // Blue
          "secondary": "#6366f1",         // Indigo
          "accent": "#f59e0b",            // Amber
          "neutral": "#1f2937",           // Gray-800
          "base-100": "#ffffff",          // White background
          "base-200": "#f3f4f6",          // Gray-100
          "base-300": "#e5e7eb",          // Gray-200
          "base-content": "#1f2937",      // Gray-800 text
          "info": "#3b82f6",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
      {
        dark: {
          "primary": "#60a5fa",           // Blue-400
          "secondary": "#818cf8",          // Indigo-400
          "accent": "#fbbf24",             // Amber-400
          "neutral": "#1f2937",            // Gray-800
          "base-100": "#1f2937",           // Gray-800 background
          "base-200": "#374151",           // Gray-700
          "base-300": "#4b5563",           // Gray-600
          "base-content": "#e5e7eb",       // Gray-200 text
          "info": "#60a5fa",
          "success": "#4ade80",
          "warning": "#fbbf24",
          "error": "#f87171",
        },
      },
    ],
    darkTheme: "dark",
  },
});