import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import replace from 'rollup-plugin-replace';
import { replaceEnvVariables } from './env';

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
    replace(replaceEnvVariables()),
  ],
  outputTargets: [
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'dist',
      esmLoaderPath: '../loader',
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
