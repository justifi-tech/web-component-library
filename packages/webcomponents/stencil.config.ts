import { Config } from '@stencil/core';
import dotenv from 'dotenv';
import replace from '@rollup/plugin-replace';

dotenv.config({ path: '../../.env' });

export const config: Config = {
  namespace: 'webcomponents',
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
      API_ORIGIN: JSON.stringify(process.env.API_ORIGIN),
    }),
  ],
  validatePrimaryPackageOutputTarget: true,
  sourceMap: false,
  testing: {
    setupFiles: ['./setupTests.js'],
    moduleNameMapper: {
      '\\.(svg|png|jpg|jpeg|gif|webp)$': '<rootDir>/src/__mocks__/fileMock.js',
    },
  },
};
