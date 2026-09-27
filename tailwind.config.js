/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#F8FAFC',
          secondary: '#F1F5F9',
          tertiary: '#E2E8F0',
          card: 'rgba(255, 255, 255, 0.88)',
          glass: 'rgba(255, 255, 255, 0.82)',
        },
        accent: {
          mint: '#10B981',
          'mint-light': '#34D399',
          indigo: '#6366F1',
          'indigo-light': '#818CF8',
          violet: '#8B5CF6',
          coral: '#F43F5E',
          'coral-light': '#FB7185',
          gold: '#F59E0B',
          'gold-light': '#FBBF24',
          cyan: '#0EA5E9',
          'cyan-light': '#38BDF8',
          pink: '#EC4899',
        },
        border: {
          subtle: 'rgba(0, 0, 0, 0.08)',
          glow: 'rgba(255, 255, 255, 0.85)',
          gold: 'rgba(245, 158, 11, 0.3)',
          mint: 'rgba(16, 185, 129, 0.3)',
          coral: 'rgba(244, 63, 94, 0.3)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glass': '0 20px 45px -15px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.8)',
        'card-hover': '0 25px 50px -12px rgba(99, 102, 241, 0.15)',
        'glow-mint': '0 8px 25px rgba(16, 185, 129, 0.28)',
        'glow-indigo': '0 8px 25px rgba(99, 102, 241, 0.28)',
        'glow-coral': '0 8px 25px rgba(244, 63, 94, 0.28)',
        'glow-cyan': '0 8px 25px rgba(14, 165, 233, 0.28)',
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '20px',
        'heavy': '28px',
      },
    },
  },
  plugins: [],
}
