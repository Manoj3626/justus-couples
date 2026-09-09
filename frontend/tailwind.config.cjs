module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        rose: {
          DEFAULT: '#C44569',
          deep: '#9E3155',
          soft: '#E98BA5',
        },
        burgundy: '#681F3B',
        blush: {
          DEFAULT: '#F7DDE4',
          light: '#FFF1F4',
        },
        cream: '#FFF9F7',
        dark: '#2B2025',
        secondary: '#75676E',
        justusBorder: '#EADDE2',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"DM Serif Display"', 'serif'],
      },
    },
  },
  plugins: [],
}
