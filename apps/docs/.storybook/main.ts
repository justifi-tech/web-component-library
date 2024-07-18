import { dirname, join } from 'path';
import { mergeConfig } from 'vite';
import react from '@vitejs/plugin-react';

const config = {
  framework: getAbsolutePath('@storybook/web-components-vite'),
  stories: ['../stories/**/*.@(mdx|stories.@(ts|tsx))'],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    {
      name: '@storybook/addon-essentials',
      options: {
        measure: false,
        outline: false,
        backgrounds: false,
        viewport: false,
      },
    },
    '@chromatic-com/storybook',
  ],
  docs: {},
  staticDirs: ['../public'],
  core: {
    builder: '@storybook/builder-vite',
  },
  async viteFinal(config) {
    const storybookMocksEnabled = process.env.VITE_STORYBOOK_MOCKS_ENABLED;
    const storybookChromaticBuild = process.env.VITE_STORYBOOK_CHROMATIC_BUILD;

    return mergeConfig(config, {
      plugins: [react()],
      define: {
        __VITE_STORYBOOK_MOCKS_ENABLED__: JSON.stringify(storybookMocksEnabled),
        __VITE_STORYBOOK_CHROMATIC_BUILD__: JSON.stringify(
          storybookChromaticBuild
        ),
      },
    });
  },
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
