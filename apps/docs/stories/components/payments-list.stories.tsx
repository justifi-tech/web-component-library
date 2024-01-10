import type { Meta, StoryObj } from '@storybook/web-components';
import '@justifi/webcomponents/dist/module/justifi-payments-list';

const meta: Meta = {
  title: 'Components/PaymentsList',
  component: 'justifi-payments-list',
  argTypes: {
    accountId: {
      type: 'string',
      description: 'Account ID',
      defaultValue: '1234567890',
      control: {
        type: 'text',
      },
    },
    authToken: {
      type: 'string',
      description: 'Auth Token',
      defaultValue: '1234567890',
      control: {
        type: 'text',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

//👇 Throws a type error it the args don't match the component props
export const Primary: Story = {
  args: {
  },
};
