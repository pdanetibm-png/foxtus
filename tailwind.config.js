/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#0b0a0e',
        ember: '#e07a3f',
        fog: '#d8d4cc',
        fox: '#c2603a',
        moss: '#4a5d3a',
      },
      fontFamily: {
        serif: ['"EB Garamond"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
