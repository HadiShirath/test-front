/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#008FFB",
        color1: "#775DD0",
        color2: "#01E297",
        color3: "#FFB119",
        color4: "#FF4560",
        color5: "#6b7280",
      },
    },
  },
  plugins: [require("tailwindcss-no-scrollbar")],
};
