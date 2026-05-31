/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0B0D12',       // Carbon Black
        surface: '#FFFFFF',
        surfaceAlt: '#F8F9FA',
        accent: '#10b981',        // MEDS Emerald Green
        gold: '#D4AF37',          // TerangaLearn-style accent for premium elements
        success: '#10B981',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        heading: ['"Playfair Display"', 'serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0,0,0,0.05)',
        'float': '0 20px 50px -15px rgba(0,0,0,0.08)',
        'premium': '0 20px 60px -15px rgba(16,185,129,0.2)',
        'glow-green': '0 10px 30px -10px rgba(16,185,129,0.4)',
        'glow-dark': '0 10px 30px -10px rgba(11,13,18,0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'blob': 'blob 12s infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -40px) scale(1.05)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
