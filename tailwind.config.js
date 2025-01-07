/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'gray-750': '#2d374850',
      },
    },
  },
  plugins: [
    async () => {
      const scrollbarHide = await import('tailwind-scrollbar-hide');
      return scrollbarHide.default();
    },
  ],
} 