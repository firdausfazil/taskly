/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        Poppin_black: ['Poppins-Black'],
        Poppin_blackitalic: ['Poppins-BlackItalic'],
        Poppin_bold: ['Poppins-Bold'],
        Poppin_extralight: ['Poppins-ExtraLight']
      }
    },
  },
  plugins: [],
  darkMode: "class",
}