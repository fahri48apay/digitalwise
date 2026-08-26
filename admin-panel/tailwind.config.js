/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#006B5E',
          50: '#E6F5F2',
          100: '#B3E0DA',
          200: '#80CCC2',
          300: '#4DB7AA',
          400: '#1AA292',
          500: '#006B5E',
          600: '#00584D',
          700: '#00453C',
          800: '#00322B',
          900: '#001F1A',
        },
        accent: {
          DEFAULT: '#FF6B35',
          50: '#FFF3EE',
          100: '#FFE0D4',
          200: '#FFCAB9',
          300: '#FFB49D',
          400: '#FF9E82',
          500: '#FF6B35',
          600: '#E55A26',
          700: '#CC4A17',
          800: '#B23908',
          900: '#992800',
        },
        dark: {
          900: '#0D1B2A',
          800: '#1B2838',
          700: '#2A3A4F',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
