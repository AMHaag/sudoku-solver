/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      gridRowEnd: {
        8: '8',
        9: '9',
      },
      gridRowStart: {
        8: '8',
        9: '9',
      },
    },
  },
  plugins: [],
};
