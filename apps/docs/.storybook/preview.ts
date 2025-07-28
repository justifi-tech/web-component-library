export const parameters = {
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
      order: [
        'Introduction',
        'Changelog',
        'Frameworks',
        'Modular Checkout',
        [
          'Introduction',
          'Modular Checkout',
          'Checkout Summary',
          'Season Interruption Insurance',
          'Card Form',
          'Bank Account Form',
          'Saved Payment Methods',
          'Sezzle Payment Method',
          'Billing Information Form',
          'Postal Code Form',
        ],
        '*',
      ],
    },
  },
};
export const tags = ['autodocs'];
