import type { Meta, StoryObj } from '@storybook/web-components';
import { withActions } from '@storybook/addon-actions/decorator';
import { StoryBaseArgs, customStoryDecorator } from '../utils';

import '@justifi/webcomponents/dist/module/justifi-business-details';

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(['business-id', 'auth-token']);

const meta: Meta = {
  title: 'Entities/BusinessDetails',
  component: 'justifi-business-details',
  args: {
    ...storyBaseArgs.args,
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
  },
  decorators: [
    customStoryDecorator,
    // @ts-ignore
    withActions // https://github.com/storybookjs/storybook/issues/22384
  ],
};

export const Basic: Story = {};

export default meta;
