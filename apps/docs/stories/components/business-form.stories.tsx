import type { Meta, StoryObj } from '@storybook/web-components';
import { withActions } from '@storybook/addon-actions/decorator';
import { StoryBaseArgs, customStoryDecorator } from '../utils';

import '@justifi/webcomponents/dist/module/justifi-business-form';

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(['auth-token', 'business-id']);

const meta: Meta = {
  title: 'Components/BusinessForm',
  component: 'justifi-business-form',
  args: {
    ...storyBaseArgs.args,
    'test-mode': true
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
    'test-mode': {
      table: {
        disable: true
      },
    }
  },
  parameters: {
  },
  decorators: [
    customStoryDecorator,
    withActions // https://github.com/storybookjs/storybook/issues/22384
  ],
};

export const Basic: Story = {};

export default meta;
