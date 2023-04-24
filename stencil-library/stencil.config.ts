import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { reactOutputTarget as react } from '@stencil/react-output-target';

export const config: Config = {
  namespace: 'webcomponents',
  globalStyle: './src/styles/root.scss',
  plugins: [sass({
    injectGlobalPaths: [
      './node_modules/bootstrap/scss/_functions.scss',
      './node_modules/bootstrap/scss/_variables.scss',
      './node_modules/bootstrap/scss/_maps.scss',
      './node_modules/bootstrap/scss/_mixins.scss',
      './node_modules/bootstrap/scss/_utilities.scss',
      './node_modules/bootstrap/scss/_reboot.scss',
      './node_modules/bootstrap/scss/_root.scss',
      './src/styles/_mixins.scss'
    ],
    includePaths: ['./node_modules/bootstrap/scss/']
  })],
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
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'docs-json',
      file: 'docs.json'
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      copy: [{
        src: './components/**/example.html',
        keepDirStructure: true
      }]
    },
  ],
  // Uncomment to develop if needed
  // testing: {
  //   browserHeadless: false,
  //   browserSlowMo: 2000,
  // }
};
