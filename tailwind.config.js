/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF9933', // Saffron
          light: '#FFAA44',
          dark: '#EE8822',
        },
        secondary: {
          DEFAULT: '#D4AF37', // Gold
          light: '#FFD700',
          dark: '#B8860B',
        },
        copper: {
          DEFAULT: '#B87333',
          light: '#CD7F32',
          dark: '#A0522D',
        },
        saffron: '#FF9933',
        gold: '#D4AF37',
        dark: {
          DEFAULT: '#1A1410', // Stone dark
          lighter: '#2A1F1A',
          light: '#3A2F2A',
        },
        wheat: '#F5DEB3', // Parchment text
      },
      fontFamily: {
        serif: ['Cinzel', 'Cormorant Garamond', 'serif'],
        sans: ['Poppins', 'Inter', 'sans-serif'],
        body: ['Poppins', 'Inter', 'sans-serif'],
        decorative: ['Cinzel', 'serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          'from': { textShadow: '0 0 10px #8B5CF6, 0 0 20px #8B5CF6, 0 0 30px #8B5CF6' },
          'to': { textShadow: '0 0 20px #06B6D4, 0 0 30px #06B6D4, 0 0 40px #06B6D4' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 153, 51, 0.5)',
        'glow-lg': '0 0 40px rgba(255, 153, 51, 0.7)',
        'cyan-glow': '0 0 20px rgba(212, 175, 55, 0.5)',
        'copper-glow': '0 0 20px rgba(184, 115, 51, 0.5)',
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.5)',
        'saffron-glow': '0 0 20px rgba(255, 153, 51, 0.5)',
      },
    },
  },
  plugins: [],
}


