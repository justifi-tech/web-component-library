export const parameters = {
  actions: { argTypesRegex: '^on.*' },
  controls: {
    hideNoControlsWarning: true,
    expanded: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      method: 'alphabetical',
      order: ['Introduction', 'React', '*', 'Changelog'],
    },
  }
};
