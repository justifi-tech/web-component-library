import { mergeConfig } from 'vite';
import react from '@vitejs/plugin-react'

const config = {
  framework: '@storybook/web-components-vite',
  stories: ["../stories/**/*.stories.@(mdx|ts|tsx)"],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-docs'
  ],
  docs: {
    autodocs: true,
  },
  async viteFinal(config, { configType }) {
    return mergeConfig(config, {
      plugins: [react()],
    });
  },
};

export default config;
