import type { Meta, StoryObj } from '@storybook/web-components';
import { withActions } from '@storybook/addon-actions/decorator';
import { StoryBaseArgs } from '../utils';

import '@justifi/webcomponents/dist/module/justifi-insurance';

const storyBaseArgs = new StoryBaseArgs(['auth-token']);

const meta: Meta = {
  title: 'Payment Facilitation/Payments/Insurance',
  component: 'justifi-insurance',
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
    return `<justifi-insurance auth-token="${args['auth-token']}" checkout-id="${args['checkout-id']}"></justifi-insurance>`;
  }
}

export const Basic: StoryObj = {};
Basic.decorators = [
  // @ts-ignore
  withActions
];

export default meta;
