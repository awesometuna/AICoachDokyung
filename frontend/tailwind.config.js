/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        'sunset-coral': '#FF7F50',
        'golden-hour': '#FFB74D',
        'pure-white': '#FFFFFF',
        'warm-white': '#FFFAFA',
        'sunset-border': '#FFDAB9',
        'charcoal': '#333333',
        'warm-gray': '#8D8D8D',
        'alert-red': '#FF6B6B',
      }
    },
  },
  plugins: [],
}
