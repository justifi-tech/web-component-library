import type { Meta, StoryObj } from '@storybook/web-components';
import { withActions } from '@storybook/addon-actions/decorator';
import StoryBaseArgs from '../shared/base-args';
import '@justifi/webcomponents/dist/module/justifi-payments-list';

const storyBaseArgs = new StoryBaseArgs(['account-id', 'auth-token']);

const meta: Meta = {
  title: 'Components/PaymentsList',
  component: 'justifi-payments-list',
  args: {
    ...storyBaseArgs.args,
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
  },
  parameters: {
    actions: {
      handles: ['payment-row-clicked'],
    },
  },
  decorators: [withActions],
};

export default meta;

type Story = StoryObj;

export const Basic: Story = {
};
