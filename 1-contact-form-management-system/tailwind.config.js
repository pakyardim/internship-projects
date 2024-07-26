/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        primary: ["Gabarito", "sans-serif"],
      },
      colors: {
        primary: "#fa615b",
        secondary: "#fff5ee",
        tertiary: "#f5f5f5",
        dark: "#333333",
        light: "#ffffff",
        gray: "#807c7b",
        darkBackground: "#323136",
      },
    },
  },
  plugins: [],
};
