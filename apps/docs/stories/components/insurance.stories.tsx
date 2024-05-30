import type { Meta, StoryObj } from '@storybook/web-components';
import { withActions } from '@storybook/addon-actions/decorator';
import { StoryBaseArgs } from '../utils';

import '@justifi/webcomponents/dist/module/justifi-season-interruption-insurance';

const storyBaseArgs = new StoryBaseArgs(['auth-token']);

const meta: Meta = {
  title: 'Insurance/Season Interruption',
  component: 'justifi-season-interruption-insurance',
  args: {
    ...storyBaseArgs.args,
    'checkout-id': '123'
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
    'checkout-id': {
      description: 'Checkout ID `string`',
      table: {
        category: 'props'
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
    return `
      <justifi-season-interruption-insurance
        auth-token="${args['auth-token']}"
        checkout-id="${args['checkout-id']}">
      </justifi-season-interruption-insurance>
    `;
  }
}

export const Basic: StoryObj = {};
Basic.decorators = [
  // @ts-ignore
  withActions
];

export default meta;
