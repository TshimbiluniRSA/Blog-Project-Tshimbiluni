/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#003366', // Deep Navy Blue
        secondary: '#0099cc', // Sky Blue
      },
    },
  },
  plugins: [],
}
