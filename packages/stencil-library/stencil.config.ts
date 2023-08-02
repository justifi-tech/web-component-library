import { Config } from '@stencil/core/internal';
import { reactOutputTarget } from '@stencil/react-output-target';
import { sass } from '@stencil/sass';
import dotenv from 'dotenv';
import replace from 'rollup-plugin-replace';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export const config: Config = {
  namespace: 'stencil-library',
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
    // By default, the generated proxy components will
    // leverage the output from the `dist` target, so we
    // need to explicitly define that output alongside the
    // React target
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    reactOutputTarget({
      componentCorePackage: 'stencil-library',
      proxiesFile: '../react-library/lib/components/stencil-generated/index.ts',
    }),
  ],
};