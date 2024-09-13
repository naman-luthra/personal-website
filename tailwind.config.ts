import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'matte-black': {
          light: '#3D3D3D',
          DEFAULT:'#2b2b2b',
          dark:'#272727'
        },
        'mint-green': '#0fb',
        'react-blue': {
          light: '#65CEFF',
          DEFAULT: '#00A8F6'
        },
        'magenta': '#e31f71',
        'brinjal': '#8838b4',
        'bright-yellow': '#ffe240',
        'gray-dark': '#273444',
        'dark-blue': '#0057ff',
        'neon-red': '#ff3131',
        'mongo-green': '#14A851',
        'theme': 'var(--color-theme)',
        'theme-light': 'var(--color-theme-light)',
        'theme-lightest': 'var(--color-theme-lightest)',
        'theme-dark': 'var(--color-theme-dark)',
        'theme-darkest': 'var(--color-theme-darkest)',
        'theme-light-text': 'var(--color-theme-light-text)',
        'theme-dark-text': 'var(--color-theme-dark-text)',
        'theme-muted-light': 'var(--color-theme-muted-light)',
        'theme-muted-dark': 'var(--color-theme-muted-dark)',
        'theme-muted-medium': 'var(--color-theme-muted-medium)',
        'theme-muted-light-medium': 'var(--color-theme-muted-light-medium)',
        'theme-muted-dark-medium': 'var(--color-theme-muted-dark-medium)',
      }
    },
  },
  plugins: [],
};
export default config;
