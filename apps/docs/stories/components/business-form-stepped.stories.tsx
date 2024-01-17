import type { Meta, StoryObj } from '@storybook/web-components';
import { withActions } from '@storybook/addon-actions/decorator';
import { StoryBaseArgs, customStoryDecorator } from '../utils';

import '@justifi/webcomponents/dist/module/justifi-business-form-stepped';

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(['account-id', 'auth-token']);

const meta: Meta = {
  title: 'Components/BusinessFormStepped',
  component: 'justifi-business-form-stepped',
  args: {
    ...storyBaseArgs.args,
    'test-mode': true
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
    'business-id': {
      type: 'string',
      description: 'An optionally provided business ID for updating a business. If not provided, a new business will be created.',
      control: {
        type: 'text',
      }
    },
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
