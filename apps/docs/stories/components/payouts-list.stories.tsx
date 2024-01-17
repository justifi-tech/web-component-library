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
    // @ts-ignore - Ignore Storybook bug (reference to bug issue)
    withActions // https://github.com/storybookjs/storybook/issues/22384
  ],
};

export const Basic: Story = {};

export const Styled: Story = {
  args: {
    style: {
      'justifi-payouts-list::part(table-head-cell)': {
        'background-color': '#F4F4F6'
      },
      'justifi-payouts-list::part(pagination-bar)': {
        'background-color': '#F4F4F6'
      },
      'justifi-payouts-list::part(arrow)': {
        '--bs-btn-disabled-bg': '#212529',
        '--bs-btn-disabled-border-color': '#212529',
        '--bs-btn-bg': '#212529',
        '--bs-btn-border-color': '#212529',
        '--bs-btn-hover-bg': '#fccc32',
        '--bs-btn-hover-border-color': '#fccc32'
      },
      'justifi-payouts-list::part(error-state)': {
        'color': 'red',
        'background-color': '#EEEEF5'
      },
      'justifi-payouts-list::part(loading-state-cell)': {
        'background-color': '#EEEEF5'
      },
      'justifi-payouts-list::part(table-row)': {
        'background-color': '#EEEEF5'
      },
      'justifi-payouts-list::part(table-row-even)': {
        'background-color': '#F4F4F6'
      }
    }
  }
};

export default meta;
