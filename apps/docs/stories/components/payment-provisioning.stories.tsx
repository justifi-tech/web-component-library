import type { Meta, StoryObj } from '@storybook/web-components';
import { withActions } from '@storybook/addon-actions/decorator';
import { StoryBaseArgs, customStoryDecorator } from '../utils';

import '@justifi/webcomponents/dist/module/justifi-payment-provisioning';

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(['auth-token', 'business-id']);

const meta: Meta = {
  title: 'Entities/Payment Provisioning (BETA)',
  component: 'justifi-payment-provisioning',
  args: {
    ...storyBaseArgs.args
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
    'form-title': {
      type: 'string',
      description: 'This prop updates the value of the title displayed at the top of the form.',
      control: {
        type: 'text',
      },
      table: {
        category: 'props',
        defaultValue: { summary: 'Business Information' }
      }
    },
    'remove-title': {
      type: 'boolean',
      description: 'This prop removes the title displayed at the top of the form.',
      control: {
        type: 'boolean',
      },
      table: {
        category: 'props',
        defaultValue: { summary: 'false' }
      }
    },
    'allow-optional-fields': {
      type: 'boolean',
      description: 'When set to `true`, this prop allows most fields in each form step to be nullable, allowing for quicker form completion. Note - the following fields are still required: `business.legal_name`, `representative.name`, `owner.name`.',
      control: {
        type: 'boolean',
      },
      table: {
        category: 'props',
        defaultValue: { summary: 'false' }
      }
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
    }
  },
  parameters: {
    actions: {
      handles: [
        'submitted',
        'click-event',
        'error-event'
      ]
    },
    chromatic: {
      delay: 2000,
    },
  },
  decorators: [
    customStoryDecorator,
    // @ts-ignore
    withActions // https://github.com/storybookjs/storybook/issues/22384
  ],
};

export const Basic: Story = {};

export default meta;
