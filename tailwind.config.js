/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--qwik-primary)",
        secondary: "var(--qwik-secondary)",
      },
      animation: {
        wiggle: "wiggle 0.25s cubic-bezier(0.34, 0.12, 0.34, 1.07)",
        fadeIn: "fadeIn 5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          '0%': {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
        wiggle: {
          "0%, 100%": {
            transform: "rotate(0deg) translateX(0)",
          },
          "25%": {
            transform: "rotate(1deg) translateX(1px)",
          },
          "55%": {
            transform: "rotate(-0.75deg) translateX(-1px)",
          },
          "100%": {
            transform: "rotate(0deg) translateX(0)",
          },
        },
      },
      borderRadius: {
        card: "5% / 3.571428571428571%",
      },
    },
  },
  plugins: [],
};
