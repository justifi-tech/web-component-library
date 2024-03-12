import type { Meta, StoryObj } from '@storybook/web-components';
import { withActions } from '@storybook/addon-actions/decorator';
import { StoryBaseArgs, customStoryDecorator } from '../utils';

import '@justifi/webcomponents/dist/module/justifi-payments-list';

type Story = StoryObj;

const storyBaseArgs = new StoryBaseArgs(['account-id', 'auth-token']);

const meta: Meta = {
  title: 'Payment Facilitation/Merchant Tools/Payments List',
  component: 'justifi-payments-list',
  args: {
    ...storyBaseArgs.args,
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
  },
  parameters: {
    actions: {
      handles: ['payment-row-clicked'],
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
      'justifi-payments-list::part(table-head)': {},
      'justifi-payments-list::part(table-head-row)': {},
      'justifi-payments-list::part(table-head-cell)': {
        'background-color': '#fff',
        'font-weight': '600',
        'font-size': '0.8rem',
        'text-transform': 'uppercase',
        'letter-spacing': '0.1em',
      },
      'justifi-payments-list::part(table-body)': {},
      'justifi-payments-list::part(table-row)': {},
      'justifi-payments-list::part(table-row):hover': {
        'cursor': 'pointer',
      },
      'justifi-payments-list::part(table-row-even)': {},
      'justifi-payments-list::part(table-row-odd)': {},
      'justifi-payments-list::part(table-cell)': {
        'background-color': 'transparent',
        'font-weight': 'normal',
        'font-size': '0.8rem',
      },
      'justifi-payments-list::part(loading-state-cell)': {},
      'justifi-payments-list::part(loading-state-spinner)': {
        'color': '#ccc',
      },
      'justifi-payments-list::part(error-state)': {},
      'justifi-payments-list::part(empty-state)': {},
      'justifi-payments-list::part(pagination-bar)': {
        'background-color': '#fff',
        'border-bottom': 'none',
      },
      'justifi-payments-list::part(page-button)': {
        'border': 'none',
        'background-color': 'transparent',
        'text-transform': 'uppercase',
        'font-weight': 'normal',
        'font-size': '0.8rem',
      },
      'justifi-payments-list::part(page-button-disabled)': {
        'opacity': '0.5',
        'cursor': 'not-allowed',
      },
      'justifi-payments-list::part(page-arrow)': {
        'display': 'none',
      },
      'justifi-payments-list::part(page-button-text)': {},
    }
  }
};

export default meta;
