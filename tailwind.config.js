/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        farm: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        harvest: {
          deep: '#142318',      // Rich dark botanical/soil green
          primary: '#2D6A4F',   // Forest green brand primary
          emerald: '#40916C',   // Medium lush green
          sage: '#52B788',      // Soft natural green
          mint: '#74C69D',      // Accent highlight
          pale: '#D8F3DC',      // Soft badge green
          cream: '#F8FAF6',     // Off-white organic background
          surface: '#FFFFFF',   // Card background
          warm: '#F1F5EE',      // Elevated container fill
          border: '#E2E8DF',    // Delicate earthy border
          clay: '#C86D51',      // Terracotta/harvest tone
          amber: '#D97706',     // Crop maturity / warning tone
          text: '#132A13',      // Ultra readable high-contrast dark text
          muted: '#526154',     // Readable secondary text
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px -2px rgba(20, 35, 24, 0.06), 0 1px 3px 0 rgba(20, 35, 24, 0.04)',
        'card': '0 4px 16px -3px rgba(20, 35, 24, 0.08), 0 2px 6px -2px rgba(20, 35, 24, 0.04)',
        'float': '0 10px 25px -5px rgba(45, 106, 79, 0.25), 0 8px 10px -6px rgba(45, 106, 79, 0.2)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '2xl': '1.25rem',
        'xl': '1rem',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
}
