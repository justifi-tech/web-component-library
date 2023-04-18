import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { reactOutputTarget as react } from '@stencil/react-output-target';

export const config: Config = {
  namespace: 'webcomponents',
  plugins: [sass({
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
