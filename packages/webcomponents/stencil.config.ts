import { Config } from '@stencil/core';
import dotenv from 'dotenv';
import replace from '@rollup/plugin-replace';

dotenv.config();

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
  plugins: [
    replace({
      PROXY_API_ORIGIN: JSON.stringify(process.env.PROXY_API_ORIGIN),
      IFRAME_ORIGIN: JSON.stringify(process.env.IFRAME_ORIGIN),
    }),
  ],
  validatePrimaryPackageOutputTarget: true,
  sourceMap: false,
  testing: {
    setupFiles: ['./setupTests.js'],
  },
  buildEs5: false,
  // Setting the minify flags to false will help retain console.logs
  minifyJs: false,
  minifyCss: false,
};
