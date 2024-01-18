import type { Meta, StoryObj } from '@storybook/web-components';
import { withActions } from '@storybook/addon-actions/decorator';
import { StoryBaseArgs, customStoryDecorator } from '../utils';

import '@justifi/webcomponents/dist/module/justifi-payouts-list';

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(['account-id', 'auth-token']);

const meta: Meta = {
  title: 'Components/PayoutsList',
  component: 'justifi-payouts-list',
  args: {
    ...storyBaseArgs.args,
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
  },
  parameters: {
    actions: {
      handles: ['payout-row-clicked'],
    },
  },
  decorators: [
    customStoryDecorator,
    withActions // https://github.com/storybookjs/storybook/issues/22384
  ],
};

export const Basic: Story = {};

export const Styled: Story = {
  args: {
    style: {
      'justifi-payouts-list::part(table-head-cell)': {
        'background-color': '#fff',
        'font-weight': '600',
        'font-size': '0.8rem',
        'text-transform': 'uppercase',
        'letter-spacing': '0.1em',
      },
      'justifi-payouts-list::part(table-cell)': {
        'background-color': 'transparent',
        'font-weight': 'normal',
        'font-size': '0.8rem',
      },
      'justifi-payouts-list::part(pagination-bar)': {
        'background-color': '#fff',
        'border-bottom': 'none'
      },
      'justifi-payouts-list::part(table-row):hover': {
        'background-color': 'rgba(0, 0, 0, 0.05)',
        'cursor': 'pointer'
      }
    }
  }
};

export default meta;
