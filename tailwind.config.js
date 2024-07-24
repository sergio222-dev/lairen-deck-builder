/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--qwik-primary)',
        secondary: 'var(--qwik-secondary)',
      }
    },
  },
  plugins: [],
};
