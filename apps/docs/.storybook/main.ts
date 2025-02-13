import { dirname, join } from 'path';
import { mergeConfig } from 'vite';

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
  docs: {
    autodocs: true,
  },
  staticDirs: ['../public'],
  core: {
    builder: '@storybook/builder-vite',
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      define: {
        __VITE_STORYBOOK_CHROMATIC_BUILD__: JSON.stringify(
          process.env.VITE_STORYBOOK_CHROMATIC_BUILD
        ),
      },
      resolve: {
        dedupe: ['@storybook/blocks'],
      },
    });
  },
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
