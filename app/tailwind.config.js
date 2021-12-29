const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  // mode : 'jit',
  purge: ["./src/**/*.{js,ts,jsx,tsx}", "./public/**/*.html"],
  // darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      ...colors,
      primary : {
        "100" : "var(--primary-100)",
        "200" : "var(--primary-200)",
        "300" : "var(--primary-300)",
        "400" : "var(--primary-400)",
        "500" : "var(--primary-500)",
        "600" : "var(--primary-600)",
        "700" : "var(--primary-700)",
        "800" : "var(--primary-800)",
        "900" : "var(--primary-900)"
      },
      secondary : {
        "100" : "var(--secondary-100)",
        "200" : "var(--secondary-200)",
        "300" : "var(--secondary-300)",
        "400" : "var(--secondary-400)",
        "500" : "var(--secondary-500)",
        "600" : "var(--secondary-600)",
        "700" : "var(--secondary-700)",
        "800" : "var(--secondary-800)",
        "900" : "var(--secondary-900)",
      },
      gray : {
        "100" : "var(--gray-100)",
        "200" : "var(--gray-200)",
        "300" : "var(--gray-300)",
        "400" : "var(--gray-400)",
        "500" : "var(--gray-500)",
        "600" : "var(--gray-600)",
        "700" : "var(--gray-700)",
        "800" : "var(--gray-800)",
        "900" : "var(--gray-900)",
      },
    },
    fontFamily: {
      sans: ["Lato", "sans-serif"],
      serif: ["Verdana", "serif"],
    },
    extend: {
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      gridTemplateColumns : {
        "sidebar" : '40px 1fr',
      },
      gridTemplateRows : {
        "header" : '60px 1fr',
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
    },
  },
  plugins: [
    // require("tailwindcss-debug-screens")
  ],
};
