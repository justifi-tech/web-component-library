import type { Meta, StoryObj } from '@storybook/web-components';
import { withActions } from '@storybook/addon-actions/decorator';
import { StoryBaseArgs } from '../utils';
import themes, { ThemeNames } from '../themes';

import '@justifi/webcomponents/dist/module/justifi-checkout';

const storyBaseArgs = new StoryBaseArgs(['auth-token']);

const meta: Meta = {
  title: 'Payment Facilitation/Payments/Checkout',
  component: 'justifi-checkout',
  args: {
    ...storyBaseArgs.args,
    'checkout-id': '123',
    'Theme': ThemeNames.Light
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
    'Theme': {
      description: 'Select a theme to preview the component in',
      options: Object.values(ThemeNames),
      control: {
        type: 'select',
      }
    },
    'checkout-id': {
      description: 'tbd', // todo
      table: {
        category: 'props'
      }
    },
    'submitted': {
      description: 'tbd', // todo
      table: {
        category: 'events'
      },
      action: true
    },
    'loadFontsOnParent': {
      description: '`loadFontsOnParent() => Promise<any>`',
      table: {
        category: 'methods'
      }
    },
  },
  parameters: {
    actions: {
      handles: [
        'submitted'
      ]
    },
    chromatic: {
      delay: 1000
    },
  },
  render: ({ label, ...args }) => {
    return `<justifi-checkout auth-token="${args['auth-token']}" checkout-id="${args['checkout-id']}"></justifi-checkout>`;
  }
}

export const Basic: StoryObj = {};
Basic.decorators = [
  (story: any, storyArgs: any) => {
    // Import the style here to not pollute other framework stories
    const selectedTheme = storyArgs.args['Theme'] as ThemeNames;
    const styleElement = document.createElement('style');
    styleElement.textContent = themes[selectedTheme];

    return `${styleElement.outerHTML}${story()}`;
  },
  withActions
];

export default meta;
