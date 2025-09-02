/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(225, 10%, 95%)',
        accent: 'hsl(160, 80%, 45%)',
        primary: 'hsl(220, 70%, 50%)',
        surface: 'hsl(0, 0%, 100%)',
        border: 'hsl(220, 13%, 91%)',
        muted: 'hsl(220, 14%, 96%)',
        foreground: 'hsl(222, 84%, 5%)',
        'muted-foreground': 'hsl(215, 16%, 47%)',
      },
      borderRadius: {
        'lg': '16px',
        'md': '10px',
        'sm': '6px',
      },
      spacing: {
        'lg': '20px',
        'md': '12px',
        'sm': '8px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(220, 70%, 50%, 0.1)',
        'modal': '0 12px 32px hsla(220, 70%, 50%, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.22,1,0.36,1)',
        'slide-in': 'slideIn 0.4s cubic-bezier(0.22,1,0.36,1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}