/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      animation: {
        bounce: "bounce 2s infinite",
    },
      colors: {
        onyx: "#0E0E10",
        porcelain: "#F7F7F5",
        warmgray: "#A8A29E",
        ceylongold: "#C9A227",
      },
    },
  },
  plugins: [],
};
