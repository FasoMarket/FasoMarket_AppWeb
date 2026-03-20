/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#17cf54',
          dark: '#12a643',
          light: '#e8faee',
        },
        brand: {
          DEFAULT: '#17cf54',
          dark: '#12a643',
          light: '#e8faee',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'custom': '8px',
      },
      keyframes: {
        'slide-up': {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        'slide-in-right': {
          '0%':   { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)',     opacity: '1' },
        },
        'slide-out-right': {
          '0%':   { transform: 'translateX(0)',    opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        'toast-in': {
          '0%':   { transform: 'translateX(120%)', opacity: '0' },
          '100%': { transform: 'translateX(0)',     opacity: '1' },
        },
        'toast-out': {
          '0%':   { transform: 'translateX(0)',    opacity: '1' },
          '100%': { transform: 'translateX(120%)', opacity: '0' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%':   { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'zoom-in': {
          '0%':   { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        },
        'badge-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%':      { transform: 'scale(1.2)' },
        },
      },
      animation: {
        'slide-up':        'slide-up 0.25s ease-out',
        'slide-in-right':  'slide-in-right 0.3s ease-out',
        'slide-out-right': 'slide-out-right 0.25s ease-in',
        'toast-in':        'toast-in 0.3s ease-out',
        'toast-out':       'toast-out 0.25s ease-in forwards',
        'fade-in':         'fade-in 0.2s ease-out',
        'fade-out':        'fade-out 0.2s ease-in',
        'zoom-in':         'zoom-in 0.25s ease-out',
        'shake':           'shake 0.4s ease-in-out',
        'badge-pulse':     'badge-pulse 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
