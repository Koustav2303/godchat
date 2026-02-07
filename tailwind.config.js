/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enables toggle-able dark mode
  theme: {
    extend: {
      // We will add the specific design tokens (colors, spacing) here in Step 4
      colors: {
        // Placeholder for future accent colors
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
      }
    },
  },
  plugins: [],
}