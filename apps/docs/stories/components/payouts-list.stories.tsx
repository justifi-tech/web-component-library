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
      'justifi-payouts-list::part(table-head)': {},
      'justifi-payouts-list::part(table-head-row)': {},
      'justifi-payouts-list::part(table-head-cell)': {
        'background-color': '#fff',
        'font-weight': '600',
        'font-size': '0.8rem',
        'text-transform': 'uppercase',
        'letter-spacing': '0.1em',
      },
      'justifi-payouts-list::part(table-body)': {},
      'justifi-payouts-list::part(table-row)': {},
      'justifi-payouts-list::part(table-row):hover': {
        'cursor': 'pointer',
      },
      'justifi-payouts-list::part(table-row-even)': {},
      'justifi-payouts-list::part(table-row-odd)': {},
      'justifi-payouts-list::part(table-cell)': {
        'background-color': 'transparent',
        'font-weight': 'normal',
        'font-size': '0.8rem',
      },
      'justifi-payouts-list::part(loading-state-cell)': {},
      'justifi-payouts-list::part(loading-state-spinner)': {
        'color': '#ccc',
      },
      'justifi-payouts-list::part(error-state)': {},
      'justifi-payouts-list::part(empty-state)': {},
      'justifi-payouts-list::part(pagination-bar)': {
        'background-color': '#fff',
        'border-bottom': 'none',
      },
      'justifi-payouts-list::part(page-button)': {
        'border': 'none',
        'background-color': 'transparent',
        'text-transform': 'uppercase',
        'font-weight': 'normal',
        'font-size': '0.8rem',
      },
      'justifi-payouts-list::part(page-button-disabled)': {
        'opacity': '0.5',
        'cursor': 'not-allowed',
      },
      'justifi-payouts-list::part(page-arrow)': {
        'display': 'none',
      },
      'justifi-payouts-list::part(page-button-text)': {},
    }
  }
};

export default meta;
