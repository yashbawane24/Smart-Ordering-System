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
        brand: {
          red: '#E50914',
          'red-hover': '#FF2D2D',
          'red-secondary': '#B91C1C',
          'red-dark': '#450A0A',
          'red-border': '#7F1D1D',
          bg: '#050505',
          surface: '#0A0A0A',
          card: '#111111',
          elevated: '#151515',
          sidebar: '#080808',
          border: '#242424',
          'border-subtle': '#1C1C1C',
          'border-sidebar': '#1F1F1F',
          input: '#0F0F0F',
          'input-border': '#2A2A2A',
          text: '#FFFFFF',
          'text-secondary': '#A3A3A3',
          'text-muted': '#737373',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'btn': '10px',
        'input': '10px',
        'modal': '18px',
      },
      boxShadow: {
        'red-glow': '0 0 20px -5px rgba(229, 9, 20, 0.3)',
        'red-subtle': '0 0 15px -3px rgba(229, 9, 20, 0.15)',
      }
    },
  },
  plugins: [],
}
