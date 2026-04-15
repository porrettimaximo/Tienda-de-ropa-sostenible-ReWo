/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sand: "#f3efe7",
        moss: "#4c6b4f",
        bark: "#3c2f2f",
        clay: "#c46b4e"
      },
      boxShadow: {
        card: "0 20px 40px rgba(33, 28, 24, 0.08)"
      }
    }
  },
  plugins: []
};
