/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdfbf7',
          100: '#faf6ed',
          200: '#f4ead3',
          300: '#eeddb9',
          400: '#e2c485',
          500: '#d6ab51',
          600: '#c19a49',
          700: '#a1803d',
          800: '#816631',
          900: '#6a5328',
        },
        temple: {
          gold: '#D4AF37',
          darkGold: '#B8860B',
          cream: '#FFF8DC',
          white: '#FFFFFF',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
