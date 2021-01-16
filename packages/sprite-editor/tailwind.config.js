module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      beep: '#ff0'
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      borderRadius: ['first', 'last'],
      cursor: ['disabled'],
      flex: ['hover'],
      opacity: ['disabled'],
    },
  },
  plugins: [],
}
