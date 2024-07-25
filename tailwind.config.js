/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        primary: ["Bangers", "sans-serif"],
        secondary: ["Gabarito", "sans-serif"],
      },
      colors: {
        primary: "#ff0000",
        primaryDark: "#cc0000",
        secondary: "#3b4cca",
        tertiary: "#ffde00",
        tertiaryDark: "#b3a125",
        dark: "#333333",
        darker: "#1e1e1e",
        light: "#ffffff",
        gray: "#807c7b",
      },
    },
  },
  plugins: [],
};
