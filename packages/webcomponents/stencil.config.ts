import { Config } from '@stencil/core';
import replace from '@rollup/plugin-replace';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('process.env', process.env);

export const config: Config = {
  namespace: 'webcomponents',
  globalStyle: './src/styles/root.css',
  outputTargets: [
    {
      type: 'dist',
    },
    {
      type: 'dist-custom-elements',
      dir: 'dist/module',
      customElementsExportBehavior: 'auto-define-custom-elements',
      isPrimaryPackageOutputTarget: true,
    },
    {
      type: 'docs-json',
      file: './dist/docs.json',
    },
  ],
  validatePrimaryPackageOutputTarget: true,
  sourceMap: false,
  plugins: [
    replace({
      // IFRAME_ORIGIN: JSON.stringify(process.env.IFRAME_ORIGIN),
      IFRAME_ORIGIN: JSON.stringify('https://components.justifi.ai/v1'),
      // PROXY_API_ORIGIN: JSON.stringify(process.env.PROXY_API_ORIGIN),
      PROXY_API_ORIGIN: JSON.stringify('https://wc-proxy.justifi.ai'),
      preventAssignment: true,
    }),
  ],
  testing: {
    setupFiles: ['./setupTests.js'],
  },
  buildEs5: false,
  // Setting the minify flags to false will help retain console.logs
  minifyJs: false,
  minifyCss: false,
};
