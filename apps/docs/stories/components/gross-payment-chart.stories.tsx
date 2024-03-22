import type { Meta, StoryObj } from '@storybook/web-components';
import { StoryBaseArgs, customStoryDecorator } from '../utils';
import { withActions } from '@storybook/addon-actions/decorator';

import '@justifi/webcomponents/dist/module/justifi-gross-payment-chart';

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(['account-id', 'auth-token']);

const meta: Meta = {
  title: 'Payment Facilitation/Merchant Tools/Gross Payments Chart',
  component: 'justifi-gross-payment-chart',
  args: {
    ...storyBaseArgs.args
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
    'token-expired': {
      description: 'Emitted when the token is expired.',
      table: {
        category: 'events'
      }
    }
  },
  parameters: {
    actions: {
      handles: [
        'tokenExpired'
      ]
    }
  },
  decorators: [
    customStoryDecorator,
    // @ts-ignore
    withActions
  ]
};

export const Basic: Story = {};

export default meta;
