import type { Config } from 'tailwindcss';
import { TimeNames } from './src/types/common';

const APP_NAME = 'eb';

function withOpacityValue(variable: string) {
  return ({ opacityValue }: { opacityValue?: number }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`;
    }
    return `rgb(var(${variable}) / ${opacityValue})`;
  };
}

const colors = {
  50: withOpacityValue(`--tw-color-${APP_NAME}-50`)({}),
  100: withOpacityValue(`--tw-color-${APP_NAME}-100`)({}),
  200: withOpacityValue(`--tw-color-${APP_NAME}-200`)({}),
  300: withOpacityValue(`--tw-color-${APP_NAME}-300`)({}),
  400: withOpacityValue(`--tw-color-${APP_NAME}-400`)({}),
  500: withOpacityValue(`--tw-color-${APP_NAME}-500`)({}),
  600: withOpacityValue(`--tw-color-${APP_NAME}-600`)({}),
  700: withOpacityValue(`--tw-color-${APP_NAME}-700`)({}),
  800: withOpacityValue(`--tw-color-${APP_NAME}-800`)({}),
  900: withOpacityValue(`--tw-color-${APP_NAME}-900`)({}),
  950: withOpacityValue(`--tw-color-${APP_NAME}-950`)({}),
};

const config: Config = {
  darkMode: 'media',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    //We use declerative spacing because when injected into the page, it will be overridden by the page's styles. We directly use pixels.
    spacing: {
      '0': '0px',
      '0.5': '2px',
      '1': '4px',
      '1.5': '6px',
      '2': '8px',
      '2.5': '10px',
      '3': '12px',
      '3.5': '14px',
      '4': '16px',
      '5': '20px',
      '6': '24px',
      '7': '28px',
      '8': '32px',
      '9': '36px',
      '10': '40px',
      '11': '44px',
      '12': '48px',
      '14': '56px',
      '16': '64px',
      '20': '80px',
      '24': '96px',
      '28': '112px',
      '32': '128px',
      '36': '144px',
      '40': '160px',
      '44': '176px',
      '48': '192px',
      '52': '208px',
      '56': '224px',
      '60': '240px',
      '64': '256px',
      '72': '288px',
      '80': '320px',
      '96': '384px',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      '5xl': '48px',
      '6xl': '64px',
      '7xl': '80px',
      '8xl': '96px',
      '9xl': '128px',
    },
    borderRadius: {
      none: '0',
      sm: '2px',
      DEFAULT: '4px',
      md: '6px',
      lg: '8px',
      xl: '12px',
      '2xl': '16px',
      '3xl': '24px',
      full: '9999px',
    },
    lineHeight: {
      '3': '12px',
      '4': '16px',
      '5': '20px',
      '6': '24px',
      '7': '28px',
      '8': '32px',
      '9': '36px',
      '10': '40px',
    },
    extend: {
      colors: {
        [APP_NAME]: colors,
        // Vakit renkleri - WEB TARAFI İLE BİREBİR AYNI
        [TimeNames.Imsak]: {
          light: '#daf2fe',
          dark: '#192b3b',
        },
        [TimeNames.Gunes]: {
          light: '#feead6',
          dark: '#40221a',
        },
        [TimeNames.Ogle]: {
          light: '#fef6cc',
          dark: '#3a281a',
        },
        [TimeNames.Ikindi]: {
          light: '#ffedd5',
          dark: '#421a25',
        },
        [TimeNames.Aksam]: {
          light: '#e0edff',
          dark: '#1b2448',
        },
        [TimeNames.Yatsi]: {
          light: '#e4e8fe',
          dark: '#212044',
        },
      },
      screens: {
        'xs-h': { raw: '(min-height: 400px)' },
        'sm-h': { raw: '(min-height: 675px)' },
        'md-h': { raw: '(min-height: 800px)' },
        'lg-h': { raw: '(min-height: 1000px)' },
        'xl-h': { raw: '(min-height: 1200px)' },
        '2xl-h': { raw: '(min-height: 1400px)' },
      },
      keyframes: {
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        slideIn: {
          from: { transform: 'translateY(100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        slideOut: {
          from: { transform: 'translateY(0)', opacity: '1' },
          to: { transform: 'translateY(100%)', opacity: '0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.3s linear infinite',
        slideIn: 'slideIn 0.3s ease-out',
        slideOut: 'slideOut 0.3s ease-in',
      },
    },
  },
  safelist: [
    // Extension'da kullanılan gerçek class'lar
    {
      pattern:
        /bg-(sky|orange|yellow|blue|indigo)-(50|100|200|300|400|500|600|700|800|900)/,
      variants: ['dark'],
    },
    {
      pattern:
        /text-(sky|orange|yellow|blue|indigo)-(50|100|200|300|400|500|600|700|800|900)/,
      variants: ['dark'],
    },
    {
      pattern:
        /bg-opacity-(0|5|10|15|20|25|30|35|40|45|50|55|60|65|70|75|80|85|90|95|100)/,
      variants: ['dark'],
    },
    {
      pattern:
        /opacity-(0|5|10|15|20|25|30|35|40|45|50|55|60|65|70|75|80|85|90|95|100)/,
      variants: ['dark'],
    },
  ],
  plugins: [],
};
export default config;
