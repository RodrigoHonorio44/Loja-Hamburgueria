/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    fontFamily: {
      'Sans': ['Roboto', 'sans-serif']
    },
    extend: {
      backgroundImage: {
        "home": "url('/assets/bg.png')"
      }
    },
  },
  plugins: [],
}

