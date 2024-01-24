import type { Meta, StoryObj } from '@storybook/web-components';
import { StoryBaseArgs, customStoryDecorator } from '../utils';

import '@justifi/webcomponents/dist/module/justifi-gross-payment-chart';

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(['account-id', 'auth-token']);

const meta: Meta = {
  title: 'Components/GrossPaymentChart',
  component: 'justifi-gross-payment-chart',
  args: {
    ...storyBaseArgs.args
  },
  argTypes: {
    ...storyBaseArgs.argTypes
  },
  parameters: {},
  decorators: [
    customStoryDecorator
  ]
};

export const Basic: Story = {};

export default meta;
