/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#203E5B",
        primaryDark: "#02234F",
        primaryLight: "#305D88",
        secondaryLight: "#FCF8EF",
        secondaryDark: "#99957F",
        neutral: "#FEFFFD",
        accent: "#F7786F"
      }
    },
    
  },
  plugins: [],
}

