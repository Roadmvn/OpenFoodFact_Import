/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      zIndex: {
        '100': '100',
      },
      colors: {
        primary: '#0B4619',    // Vert Corporate
        secondary: '#1A7431',  // Vert Clair
        success: '#2F9E44',   // Vert Success
        warning: '#F59E0B',   // Orange Warning
        danger: '#DC2626',    // Rouge Danger
        info: '#3B82F6',      // Bleu Info
        background: '#FFFFFF', // Blanc
        surface: '#F3F4F6',   // Gris Clair
        text: '#111827',      // Texte Principal
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
