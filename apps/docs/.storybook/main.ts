const config = {
  framework: '@storybook/react-vite',
  stories: ["../stories/**/*.stories.@(mdx|ts|tsx)"],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-docs'
  ],
  docs: {
    autodocs: true,
  },
};

export default config;
