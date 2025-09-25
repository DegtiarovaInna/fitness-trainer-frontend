/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx,css}",
    "./app/**/*.{js,ts,jsx,tsx,mdx,css}",
    "./components/**/*.{js,ts,jsx,tsx,mdx,css}",
  ],
  theme: {
    extend: {
      colors: {
        brand:  { DEFAULT: "#7A6F9B", light: "#8B85C1", dark: "#685155" },
        accent: "#FF6B6B",
        success:"#4FD1C5",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};