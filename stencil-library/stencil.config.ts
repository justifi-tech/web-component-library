import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { reactOutputTarget as react } from '@stencil/react-output-target';
import dotenv from 'dotenv';
import replace from 'rollup-plugin-replace';
import { angularOutputTarget } from '@stencil/angular-output-target';

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
    }),
  ],
  outputTargets: [
    react({
      componentCorePackage: '@justifi/webcomponents',
      proxiesFile: '../react-library/src/components/stencil-generated/index.ts',
      includeDefineCustomElements: true,
    }),
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    angularOutputTarget({
      componentCorePackage: '@justifi/webcomponents',
      directivesProxyFile: '../angular-library/projects/component-library/src/lib/stencil-generated/components.ts',
      directivesArrayFile: '../angular-library/projects/component-library/src/lib/stencil-generated/index.ts',
    }),
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
