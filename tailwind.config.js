/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#004643',
          hover: '#003734',
          subtle: '#085450',
          light: '#E6EFEF',
          50: '#F0F7F6',
        },
        paper: {
          bg: '#F0EDE5',
          surface: '#FFFFFF',
          soft: '#F7F5EF',
          border: '#D8D4C9',
          borderDark: '#C7C2B4',
        },
        ink: {
          primary: '#17302E',
          secondary: '#596563',
          muted: '#7B8582',
          subtle: '#A2ABA8',
        },
        status: {
          success: '#2E7D5B',
          successBg: '#EBF5F0',
          successBorder: '#BCE3D1',
          warning: '#B7791F',
          warningBg: '#FDF6E8',
          warningBorder: '#F5DEB0',
          danger: '#C94C4C',
          dangerBg: '#FDF0F0',
          dangerBorder: '#F7C6C6',
          info: '#3B6EA5',
          infoBg: '#EDF4FB',
          infoBorder: '#C1DAF2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.04)',
        'dropdown': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'btn': '7px',
        'card': '10px',
      }
    },
  },
  plugins: [],
}
