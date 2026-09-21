/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          dark: "#0b1329",
          card: "#111c38",
          border: "#1e293b",
          highlight: "#1e3a8a",
        },
        safety: {
          orange: "#ea580c",
          amber: "#d97706",
          yellow: "#eab308",
          red: "#dc2626",
          green: "#059669",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
