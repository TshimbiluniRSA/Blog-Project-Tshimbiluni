/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#003366', // Sasol Blue
        secondary: '#0099cc', // Sasol Light Blue
      },
    },
  },
  plugins: [],
}
