/** @type {import('tailwindcss').Config} */
export default {
  content: ["index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "n1": "#e5e5e5",
        "custom-green": "#008000",
      },
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
      },
      backgroundColor: {
        'form-bg': 'hsla(0, 0%, 81%, .275)',
        'form-dark': 'hsla(0, 0%, 81%, .45)',
      },
      screens: {
        '3xl': '2160px', 
        'm500': '500px', 
        'mobile-l': '430px',
        'mobile-m': '380px',
        'mobile-s': '330px',
      },
      animation: {
        'blinking': 'blinking 6s infinite ease-in-out',
      },
      keyframes: {
        'blinking': {
          '0%, 100%': { backgroundColor: '#00000000' },
          '20%, 80%': { backgroundColor: '#00000069' },
        },
      }
    },
  },
  plugins: [],
}

