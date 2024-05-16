import type { Meta, StoryObj } from '@storybook/web-components';
import { StoryBaseArgs, customStoryDecorator } from '../utils';
import { withActions } from '@storybook/addon-actions/decorator';

import '@justifi/webcomponents/dist/module/form-control-file';

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(['account-id', 'auth-token']);

const meta: Meta = {
  title: 'Entities/file-input',
  component: 'form-control-file',
  args: {
    ...storyBaseArgs.args
  },
  argTypes: {
    ...storyBaseArgs.argTypes
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
