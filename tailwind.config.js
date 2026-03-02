/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 0.2s ease-out",
        scaleIn: "scaleIn 0.2s ease-out",
        ripple: "ripple 500ms linear forwards",
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