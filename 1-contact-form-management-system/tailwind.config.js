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
        primaryDark: "#9a4a47",
        secondary: "#fff5ee",
        tertiary: "#f5f5f5",
        dark: "#262626",
        light: "#ffffff",
        grayish: "#807c7b",
        darkBackground: "#323136",
      },
    },
  },
  plugins: [],
};
