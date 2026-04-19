/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './providers/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        sand: '#F2F6FF',
        panel: '#FFFFFF',
        ink: '#0F1E37',
        mute: '#6B7B93',
        line: '#D6E2F3',
        glass: 'rgba(255,255,255,0.7)',
        mist: '#EEF4FF',
        add: '#3B82F6',
        addSoft: '#D9E7FF',
        spend: '#EF4444',
        spendSoft: '#FFE3E3',
        gold: '#F59E0B',
        goldSoft: '#FFF0CD',
        sky: '#1E40AF',
        skySoft: '#E2ECFF',
      },
      boxShadow: {
        card: '0 18px 44px rgba(37, 99, 235, 0.14)',
        float: '0 24px 54px rgba(15, 30, 55, 0.14)',
      },
      borderRadius: {
        '4xl': '32px',
      },
    },
  },
  plugins: [],
};
