module.exports = {
  "stories": ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  "addons": ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-interactions", "@pxtrn/storybook-addon-docs-stencil"],
  "framework": {
    name: "@storybook/html-webpack5",
    options: {}
  },
  docs: {
    autodocs: true
  }
};