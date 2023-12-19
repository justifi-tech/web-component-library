import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import dotenv from 'dotenv';
import replace from 'rollup-plugin-replace';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export const config: Config = {
  namespace: 'webcomponents',
  globalStyle: './src/styles/root.scss',
  plugins: [
    sass({
      injectGlobalPaths: [
        '../node_modules/bootstrap/scss/_functions.scss',
        '../node_modules/bootstrap/scss/_variables.scss',
        '../node_modules/bootstrap/scss/_variables-dark.scss',
        '../node_modules/bootstrap/scss/_maps.scss',
        '../node_modules/bootstrap/scss/_mixins.scss',
        '../node_modules/bootstrap/scss/_utilities.scss',
        '../node_modules/bootstrap/scss/_root.scss',
        '../node_modules/bootstrap/scss/_spinners.scss',
        '../node_modules/bootstrap/scss/_helpers.scss',
        './src/styles/_mixins.scss',
      ],
      includePaths: ['../node_modules/bootstrap/scss/'],
    }),
    replace({
      'process.env.IFRAME_ORIGIN': JSON.stringify(process.env.IFRAME_ORIGIN),
      'process.env.ENTITIES_API_ORIGIN': JSON.stringify(process.env.ENTITIES_API_ORIGIN),
      'process.env.ENTITIES_AUTH_TOKEN': JSON.stringify(process.env.ENTITIES_AUTH_TOKEN),
      'process.env.EXAMPLE_BUSINESS_ID': JSON.stringify(process.env.EXAMPLE_BUSINESS_ID),
      'process.env.EXAMPLE_BUSINESS_ACCOUNT_ID': JSON.stringify(process.env.EXAMPLE_BUSINESS_ACCOUNT_ID),
      'process.env.PROXY_API_ORIGIN': JSON.stringify(process.env.PROXY_API_ORIGIN),
      'process.env.PROXY_AUTH_TOKEN': JSON.stringify(process.env.PROXY_AUTH_TOKEN),
      'process.env.EXAMPLE_PAYMENTS_ACCOUNT_ID': JSON.stringify(process.env.EXAMPLE_PAYMENTS_ACCOUNT_ID),
      'process.env.EXAMPLE_PAYMENT_ID': JSON.stringify(process.env.EXAMPLE_PAYMENT_ID),
      'process.env.EXAMPLE_PAYOUT_ID': JSON.stringify(process.env.EXAMPLE_PAYOUT_ID),
      'process.env.PRIVATE_API_ORIGIN': JSON.stringify(process.env.PRIVATE_API_ORIGIN),
      'process.env.PRIVATE_AUTH_TOKEN': JSON.stringify(process.env.PRIVATE_AUTH_TOKEN),
      'process.env.EXAMPLE_PLATFORM_ACCOUNT_ID': JSON.stringify(process.env.EXAMPLE_PLATFORM_ACCOUNT_ID),
    }),
  ],
  outputTargets: [
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-json',
      file: 'docs.json',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      copy: [
        {
          src: './components/**/example.html',
          keepDirStructure: true,
        },
      ],
    },
  ],
  // Uncomment to develop if needed
  // testing: {
  //   browserHeadless: false,
  //   browserSlowMo: 2000,
  // }
};
