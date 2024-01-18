import { create } from '@storybook/theming/create';

export default create({
  base: 'light',

  // Typography
  fontBase: 'Lato, "Helvetica Neue", Arial, sans-serif',
  fontCode: 'monospace',

  // Branding
  colorPrimary: '#000',
  colorSecondary: 'rgb(221, 221, 230)',
  brandTitle: 'JustiFi Web Components',
  brandImage: 'https://justifi-brand-assets.s3.us-east-2.amazonaws.com/justifi-light-bg.png',
  brandTarget: '_self',

  // Toolbar
  barSelectedColor: '#000',
});