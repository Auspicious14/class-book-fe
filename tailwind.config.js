/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./app/index.{js,ts,jsx,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["FiraCode", "SpaceMono", "sans-serif"],
      "space-mono": ["SpaceMono", "sans-serif"],
      "fira-code": ["FiraCode", "sans-serif"],
    },
    extend: {
      fontFamily: {
        sans: ["FiraCode", "SpaceMono", "sans-serif"],
        "space-mono": ["SpaceMono", "sans-serif"],
        "fira-code": ["FiraCode", "sans-serif"],
      },
      backgroundColor: {
        primary: "#4CAF50",
        secondary: "#F5F5F5",
        accent: "#9C27B0",
      },
      textColor: {
        primary: "#4CAF50",
        dark: "#666666",
        secondary: "#F5F5F5",
        accent: "#9C27B0",
      },
      borderColor: {
        primary: "#4CAF50",
        dark: "#666666",
        secondary: "#F5F5F5",
        accent: "#9C27B0",
      },
    },
  },
  plugins: [],
};
