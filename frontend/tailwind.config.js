/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0a0a', // Deep dark background
          800: '#171717',
          700: '#262626',
        },
        primary: '#ec4899', // Neon pink
        secondary: '#a855f7', // Deep purple
        accent: '#3b82f6', // Electric blue
      },
      boxShadow: {
        glass: '0 4px 30px rgba(0, 0, 0, 0.1)',
        'glass-hover': '0 8px 32px rgba(236, 72, 153, 0.2)', // Pink glow
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
