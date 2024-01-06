import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'webcomponents',
  globalStyle: './src/styles/root.scss',
  plugins: [
    sass({
      injectGlobalPaths: [
        '../../node_modules/bootstrap/scss/_functions.scss',
        '../../node_modules/bootstrap/scss/_variables.scss',
        '../../node_modules/bootstrap/scss/_variables-dark.scss',
        '../../node_modules/bootstrap/scss/_maps.scss',
        '../../node_modules/bootstrap/scss/_mixins.scss',
        '../../node_modules/bootstrap/scss/_utilities.scss',
        '../../node_modules/bootstrap/scss/_root.scss',
        '../../node_modules/bootstrap/scss/_spinners.scss',
        '../../node_modules/bootstrap/scss/_helpers.scss',
        './src/styles/_mixins.scss',
      ],
      includePaths: ['../../node_modules/bootstrap/scss/'],
    })
  ],
  outputTargets: [
    {
      type: 'dist'
    },
    {
      type: 'dist-custom-elements',
      dir: 'dist/module',
      customElementsExportBehavior: 'single-export-module',
      isPrimaryPackageOutputTarget: true
    },
    {
      type: 'docs-json',
      file: 'dist/docs.json'
    },
  ],
  sourceMap: false
};
