/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "tertiary-container": "#f7a395",
        "tertiary-fixed-dim": "#e89689",
        secondary: "#526351",
        outline: "#757c7d",
        "on-secondary-fixed-variant": "#4f604e",
        "outline-variant": "#adb3b4",
        "secondary-container": "#d5e8d1",
        "primary-dim": "#535252",
        "tertiary-dim": "#804137",
        "surface-variant": "#dde4e5",
        "on-primary-fixed-variant": "#5c5b5b",
        "on-error-container": "#752121",
        "primary-fixed-dim": "#d6d4d3",
        "secondary-fixed": "#d5e8d1",
        "on-background": "#2d3435",
        "surface-container-highest": "#dde4e5",
        tertiary: "#8f4c42",
        "surface-bright": "#f9f9f9",
        "on-tertiary-container": "#5d251d",
        "on-secondary": "#ebfee7",
        "surface-tint": "#5f5e5e",
        "inverse-on-surface": "#9c9d9d",
        "surface-dim": "#d4dbdd",
        "surface-container-low": "#f2f4f4",
        "on-primary": "#faf7f6",
        surface: "#f9f9f9",
        error: "#9f403d",
        "tertiary-fixed": "#f7a395",
        "surface-container-lowest": "#ffffff",
        "on-error": "#fff7f6",
        "primary-fixed": "#e5e2e1",
        "inverse-surface": "#0c0f0f",
        "on-primary-fixed": "#403f3f",
        "on-tertiary-fixed": "#401009",
        "on-secondary-container": "#455644",
        "inverse-primary": "#ffffff",
        "on-surface": "#2d3435",
        "surface-container": "#ebeeef",
        "error-container": "#fe8983",
        "on-tertiary-fixed-variant": "#682e25",
        background: "#f9f9f9",
        "on-primary-container": "#525151",
        "on-tertiary": "#fff7f6",
        "on-surface-variant": "#5a6061",
        "surface-container-high": "#e4e9ea",
        "primary-container": "#e5e2e1",
        "secondary-dim": "#475746",
        "error-dim": "#4e0309",
        "on-secondary-fixed": "#334333",
        "secondary-fixed-dim": "#c7dac3",
        primary: "#5f5e5e"
      },
      boxShadow: {
        card: "0 20px 40px rgba(33, 28, 24, 0.08)"
      },
      fontFamily: {
        headline: ["Inter", "sans-serif"],
        body: ["Public Sans", "sans-serif"],
        label: ["Inter", "sans-serif"]
      },
      borderRadius: {
        lg: "0px",
        xl: "0px"
      }
    }
  },
  plugins: []
};
