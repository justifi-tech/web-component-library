import type { Meta, StoryObj } from '@storybook/web-components';
import { StoryBaseArgs, customStoryDecorator } from '../utils';

import '@justifi/webcomponents/dist/module/justifi-gross-payment-chart';
import { withActions } from '@storybook/addon-actions/decorator';

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(['account-id', 'auth-token']);

const meta: Meta = {
  title: 'Payment Facilitation/Merchant Tools/Gross Payments Chart',
  component: 'justifi-gross-payment-chart',
  args: {
    ...storyBaseArgs.args
  },
  argTypes: {
    ...storyBaseArgs.argTypes
  },
  parameters: {
    actions: {
      handles: ['errorEvent']
    }
  },
  decorators: [
    customStoryDecorator,
    // @ts-ignore - Ignore Storybook bug (reference to bug issue)
    // https://github.com/storybookjs/storybook/issues/22384
    withActions
  ]
};

export const Basic: Story = {};

export default meta;
