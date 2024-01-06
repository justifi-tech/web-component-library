module.exports = {
  stories: [
    './pages/**/*.stories.mdx',
    './pages/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@pxtrn/storybook-addon-docs-stencil',
  ],
  framework: {
    name: '@storybook/html-webpack5',
    options: {},
  },
  docs: {
    autodocs: true,
  },
  managerHead: (head) => `
  ${head}
  <style>
    #dev, #dev-components, [data-parent-id="dev-components"] {
      display: none;
    }
  </style>
  `,
};
