import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        halloween: {
          orange: '#ff6b00',
          purple: '#6b21a8',
          black: '#1a1a1a',
          green: '#22c55e',
        },
      },
    },
  },
  plugins: [],
};

export default config;
