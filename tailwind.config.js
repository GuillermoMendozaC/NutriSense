/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Institucional Obligatoria NutriSense
        navy: {
          DEFAULT: '#072B4A',
          dark: '#051E34',
        },
        institutional: {
          blue: '#004E75',
          ieee: '#0076A8',
        },
        purple: {
          embs: '#782980',
          secondary: '#9A4E9C',
          subtle: '#FAF5FA',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          bg: '#F6F8FA',
          active: '#EFF3F6',
        },
        ink: {
          DEFAULT: '#172B3A',
          secondary: '#667085',
          muted: '#98A2B3',
        },
        border: {
          DEFAULT: '#E1E7EC',
          grid: '#E8EDF1',
        },
        // Estados estrictos
        status: {
          success: '#168567',
          warning: '#DFA321',
          error: '#C94C4C',
        },
        // Gráfica de actividad específica
        activity: '#8CBCCB',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '6px',
        sm: '4px',
        md: '8px',
        lg: '8px',
        panel: '8px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(7, 43, 74, 0.05)',
        drawer: '-4px 0 24px rgba(7, 43, 74, 0.10)',
        none: 'none',
      },
    },
  },
  plugins: [],
}
