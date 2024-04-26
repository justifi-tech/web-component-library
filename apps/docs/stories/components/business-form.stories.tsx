import type { Meta, StoryObj } from '@storybook/web-components';
import { withActions } from '@storybook/addon-actions/decorator';
import { StoryBaseArgs, customStoryDecorator } from '../utils';

import '@justifi/webcomponents/dist/module/justifi-business-form';

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(['auth-token', 'business-id']);

const meta: Meta = {
  title: 'Entities/BusinessForm',
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
    },
    'submitted': {
      description: 'Emitted when the server response is received.  Will not be raised if form vailidation fails.',
      table: {
        category: 'events'
      }
    },
    'click-event': {
      description: 'Emitted when controls are clicked.  Control name is defined in `data.detail.name`.',
      table: {
        category: 'events'
      }
    },
    'clickEvent': {
      description: 'Emitted when controls are clicked.  Control name is defined in `data.detail.name`. This event will be deprecated in favor of the `click-event` event.',
      table: {
        category: 'events'
      }
    },
  },
  parameters: {
    actions: {
      handles: [
        'submitted',
        'click-event',
        'clickEvent'
      ]
    }
  },
  decorators: [
    customStoryDecorator,
    withActions // https://github.com/storybookjs/storybook/issues/22384
  ],
};

export const Basic: Story = {};

export default meta;
