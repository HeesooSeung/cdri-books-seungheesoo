import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

// Tailwind theme pins Figma Style-frame tokens 1:1. No raw hex outside token names.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#4880EE', hover: '#3a6dd1' },
        ink: {
          title: '#1A1E27',
          primary: '#353C49',
          secondary: '#6D7582',
          subtitle: '#8D94A0',
        },
        surface: {
          white: '#FFFFFF',
          light: '#F2F4F6',
          gray: '#B1B8C0',
          divider: '#D2D6DA',
        },
        palette: {
          gray: '#DADADA',
          black: '#222222',
        },
        danger: '#E84118',
      },
      fontFamily: {
        sans: ['"Noto Sans KR"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Style frame (Typography) — strict tokens.
        't1':        ['24px', { lineHeight: '24px', fontWeight: '700' }],  // Title1
        't2':        ['22px', { lineHeight: '24px', fontWeight: '700' }],  // Title2
        'h2':        ['22px', { lineHeight: '32px', fontWeight: '700' }],  // H2/Bold (Favorites title)
        'title3':    ['18px', { lineHeight: '18px', fontWeight: '700' }],  // Title3 (Style-frame)
        'b1':        ['20px', { lineHeight: '20px', fontWeight: '500' }],  // Body1
        'body2':     ['14px', { lineHeight: '14px', fontWeight: '500' }],  // Body2
        'body2b':    ['14px', { lineHeight: '14px', fontWeight: '700' }],  // Body2 bold
        'caption':   ['16px', { lineHeight: '16px', fontWeight: '500' }],  // Caption
        'small':     ['10px', { lineHeight: '10px', fontWeight: '500' }],  // Small

        // Contextual tokens (component-level Figma values).
        't3':        ['18px', { lineHeight: '26px', fontWeight: '700' }],  // H3/Bold (BookListItem*)
        'b2':        ['16px', { lineHeight: '24px', fontWeight: '500' }],  // Body/Medium
        'cap':       ['14px', { lineHeight: '22px', fontWeight: '500' }],  // Caption/Medium
        'tiny':      ['10px', { lineHeight: '22px', fontWeight: '500' }],  // Tiny/Medium
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [animate],
} satisfies Config;
