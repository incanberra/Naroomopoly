/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        coastal: {
          sand: '#F7E7CE',
          sandDark: '#E6D2B5',
          ocean: '#1A535C',
          oceanLight: '#4ECDC4',
          sunset: '#FF6B6B',
          yellow: '#FFE66D',
          eucalyptus: '#2C5E43',
          rock: '#475569',
          brown: '#8B4513',
          deepNavy: '#0B132B'
        }
      },
      fontFamily: {
        board: ['Outfit', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
