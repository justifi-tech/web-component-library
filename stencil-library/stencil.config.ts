import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { reactOutputTarget } from '@stencil/react-output-target';
import { vueOutputTarget } from '@stencil/vue-output-target';

export const config: Config = {
  namespace: 'webcomponents',
  globalStyle: './src/styles/root.scss',
  plugins: [
    sass({
      injectGlobalPaths: [
        './node_modules/bootstrap/scss/_functions.scss',
        './node_modules/bootstrap/scss/_variables.scss',
        './node_modules/bootstrap/scss/_maps.scss',
        './node_modules/bootstrap/scss/_mixins.scss',
        './node_modules/bootstrap/scss/_utilities.scss',
        './node_modules/bootstrap/scss/_root.scss',
        './src/styles/_mixins.scss',
      ],
      includePaths: ['./node_modules/bootstrap/scss/'],
    }),
  ],
  outputTargets: [
    reactOutputTarget({
      componentCorePackage: '@justifi/webcomponents',
      proxiesFile: '../react-library/src/components/stencil-generated/index.ts',
      includeDefineCustomElements: true,
    }),
    vueOutputTarget({
      componentCorePackage: '@justifi/webcomponents',
      proxiesFile: '../vue-library/src/lib/components.ts'
    }),
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
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
