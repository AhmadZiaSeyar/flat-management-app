/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './providers/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        sand: '#F6EFE4',
        panel: '#FFFFFF',
        ink: '#1F1B16',
        mute: '#716759',
        line: '#E7DCCB',
        add: '#16855D',
        addSoft: '#D9F3E8',
        spend: '#D74C3C',
        spendSoft: '#FCE2DD',
        gold: '#D9A21B',
        goldSoft: '#F9EDCA',
        sky: '#2C69D1',
        skySoft: '#DAE7FF',
      },
      boxShadow: {
        card: '0 8px 20px rgba(40, 29, 18, 0.08)',
      },
      borderRadius: {
        '4xl': '32px',
      },
    },
  },
  plugins: [],
};
