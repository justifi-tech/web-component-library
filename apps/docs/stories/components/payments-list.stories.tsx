import type { Meta, StoryObj } from '@storybook/web-components';
import { accountId, authToken } from '../arg-controls';
import '@justifi/webcomponents/dist/module/justifi-payments-list';

const meta: Meta = {
  title: 'Components/PaymentsList',
  component: 'justifi-payments-list',
  argTypes: {
    accountId,
    authToken
  }
};

export default meta;
type Story = StoryObj;

//👇 Throws a type error it the args don't match the component props
export const Primary: Story = {
  args: {
  },
};
