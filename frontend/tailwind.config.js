/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-lt": "#f4f4f4",
        "primary-dk": "#212121",
        "dark-sky": "#2b3852",
        "light-stone": "#adbad0",
        "dark-blue": "#1d4ed8",
        "link-white": "#f8fafc"
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
