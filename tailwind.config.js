/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        ios: {
          glass: 'rgba(255, 255, 255, 0.12)',
          border: 'rgba(255, 255, 255, 0.18)',
        },
      },
      boxShadow: {
        phone: '-40px 60px 150px rgba(59,38,123,0.7)',
      },
    },
  },
  plugins: [],
}
