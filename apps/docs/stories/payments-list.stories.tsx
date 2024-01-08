import type { Meta, StoryObj } from '@storybook/web-components';
import '@justifi/webcomponents/dist/module/justifi-payments-list';

const meta: Meta = {
  component: 'justifi-payments-list',
};

export default meta;
type Story = StoryObj;

//👇 Throws a type error it the args don't match the component props
export const Primary: Story = {
  args: {
    primary: true,
  },
};
