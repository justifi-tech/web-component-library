import { mergeConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Import path module

const config = {
  framework: '@storybook/web-components-vite',
  stories: ['../stories/**/*.stories.@(mdx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-docs',
  ],
  docs: {
    autodocs: true,
  },
  async viteFinal(config, { configType }) {
    // Add an alias for @justifi/webcomponents to ensure proper resolution
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        '@justifi/webcomponents': path.resolve(__dirname, '../node_modules/@justifi/webcomponents'),
      },
    };

    return mergeConfig(config, {
      plugins: [react()],
    });
  },
};

export default config;
