/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        field: {
          green: '#4ade80',
          lines: '#ffffff'
        }
      }
    },
  },
  plugins: [],
}
