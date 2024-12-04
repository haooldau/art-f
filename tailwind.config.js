/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        searchResults: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(-10px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        searchGlow: {
          '0%': {
            boxShadow: '0 0 0px #db262600'
          },
          '50%': {
            boxShadow: '0 0 15px #db262666'
          },
          '100%': {
            boxShadow: '0 0 0px #db262600'
          }
        },
        modalIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.95)'
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)'
          }
        },
        cardIn: {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        grassGrow: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.5) translateY(10px)'
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1.2) translateY(0)'
          },
          '100%': {
            opacity: '0',
            transform: 'scale(1) translateY(-10px)'
          }
        },
        confetti: {
          '0%': {
            transform: 'translateY(-10px) rotate(0deg) scale(1)',
            opacity: '1'
          },
          '30%': {
            transform: 'translateY(50px) rotate(360deg) scale(1.2)',
            opacity: '0.8'
          },
          '60%': {
            transform: 'translateY(100px) rotate(720deg) scale(0.8)',
            opacity: '0.6'
          },
          '100%': {
            transform: 'translateY(150px) rotate(1080deg) scale(0.4)',
            opacity: '0'
          }
        }
      },
      animation: {
        'searchResults': 'searchResults 0.2s ease-out forwards',
        'searchGlow': 'searchGlow 2s ease-in-out infinite',
        'modalIn': 'modalIn 0.2s ease-out',
        'cardIn': 'cardIn 0.3s ease-out forwards',
        'grassGrow': 'grassGrow 2s ease-out forwards',
        'confetti': 'confetti 0.8s ease-out forwards'
      }
    },
  },
  plugins: [],
} 