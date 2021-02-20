const colors = require("tailwindcss/colors")

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    ...colors,
    transparent: "transparent",
  },
  variants: {
    extend: {
      backgroundColor: ["active"],
      borderRadius: ["first", "last"],
      cursor: ["disabled"],
      flex: ["hover"],
      opacity: ["disabled"],
    },
  },
  plugins: [],
}
