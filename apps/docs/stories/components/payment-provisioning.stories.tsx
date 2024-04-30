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
    }
  },
  parameters: {
    actions: {
      handles: [
        'submitted',
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