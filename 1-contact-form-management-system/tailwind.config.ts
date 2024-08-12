import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#fa615b",
        primaryDark: "#9a4a47",
        secondary: "#fff5ee",
        tertiary: "#f5f5f5",
        dark: "#262626",
        light: "#ffffff",
        grayish: "#807c7b",
        darkBackground: "#323136",
        success: "#84cc16",
      },
    },
  },
  plugins: [],
};
export default config;
