import { Config } from '@stencil/core';

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
};
