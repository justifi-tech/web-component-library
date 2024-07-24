import type { Meta, StoryObj } from '@storybook/web-components';
import { withActions } from '@storybook/addon-actions/decorator';
import { StoryBaseArgs, customStoryDecorator } from '../../utils';

import '@justifi/webcomponents/dist/module/justifi-season-interruption-insurance';

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(['account-id', 'auth-token']);

const meta: Meta = {
  title: 'Insurance/Season Interruption Insurance',
  component: 'justifi-season-interruption-insurance',
  args: {
    ...storyBaseArgs.args,
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
    'error-event': {
      description: '`ComponentError`',
      table: {
        category: 'events',
      },
      action: true,
    },
  },
  parameters: {
    actions: {
      handles: ['error-event'],
    },
    chromatic: {
      delay: 2000,
    },
  },
  decorators: [
    customStoryDecorator,
    // @ts-ignore - Ignore Storybook bug (reference to bug issue)
    withActions // https://github.com/storybookjs/storybook/issues/22384
  ],
};

export const Basic: Story = {};

export default meta;
