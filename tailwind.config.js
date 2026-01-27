/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vs: {
          bg: '#1e1e1e',
          sidebar: '#333333',
          activityBar: '#252526',
          panel: '#2d2d2d',
          accent: '#007acc',
          text: '#d4d4d4'
        }
      }
    },
  },
  plugins: [],
}