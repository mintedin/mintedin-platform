import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        'cyber-teal': '#00f7ff',
        'electric-purple': '#8a2be2',
        'dark-bg': 'rgb(3,7,18)',
        'neon-blue': '#4DEEEA',
        'neon-pink': '#F000FF',
        'neon-yellow': '#FFE700',
        'cyber-black': '#0A0A0A',
      },
      fontFamily: {
        space: ['var(--font-space-grotesk)'],
        orbitron: ['var(--font-orbitron)'],
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(to right, rgb(3,7,18), rgb(24,29,49))',
        'neon-gradient': 'linear-gradient(to right, #4DEEEA, #F000FF)',
      },
      keyframes: {
        'level-up': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'neon-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px #4DEEEA, 0 0 10px #4DEEEA, 0 0 15px #4DEEEA' },
          '50%': { boxShadow: '0 0 10px #F000FF, 0 0 20px #F000FF, 0 0 30px #F000FF' },
        },
      },
      animation: {
        'level-up': 'level-up 2s ease-in-out infinite',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
      },
      boxShadow: {
        'neon-teal': '0 0 5px #00f7ff, 0 0 10px #00f7ff, 0 0 15px #00f7ff',
        'neon-purple': '0 0 5px #8a2be2, 0 0 10px #8a2be2, 0 0 15px #8a2be2',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate')
  ],
};

export default config;