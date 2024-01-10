import type { Meta, StoryObj } from '@storybook/web-components';
import { withActions } from '@storybook/addon-actions/decorator';
import StoryBaseArgs from '../shared/base-args';
import { renderComponentWithStyles } from '../shared/utils';
import '@justifi/webcomponents/dist/module/justifi-payments-list';

const storyBaseArgs = new StoryBaseArgs(['account-id', 'auth-token']);

const meta: Meta = {
  title: 'Components/PaymentsList',
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
  decorators: [withActions], // https://github.com/storybookjs/storybook/issues/22384
};

export default meta;

type Story = StoryObj;

export const Basic: Story = {};
export const Styled: Story = {
  args: {
    style: {
      'justifi-payments-list::part(table-head-cell)': {
        'background-color': '#F4F4F6'
      },
      'justifi-payments-list::part(pagination-bar)': {
        'background-color': '#F4F4F6'
      },
      'justifi-payments-list::part(arrow)': {
        '--bs-btn-disabled-bg': '#212529',
        '--bs-btn-disabled-border-color': '#212529',
        '--bs-btn-bg': '#212529',
        '--bs-btn-border-color': '#212529',
        '--bs-btn-hover-bg': '#fccc32',
        '--bs-btn-hover-border-color': '#fccc32',
      },
      'justifi-payments-list::part(error-state)': {
        'color': 'red',
        'background-color': '#EEEEF5'
      },
      'justifi-payments-list::part(loading-state-cell)': {
        'background-color': '#EEEEF5'
      },
      'justifi-payments-list::part(table-row)': {
        'background-color': '#EEEEF5'
      },
      'justifi-payments-list::part(table-row-even)': {
        'background-color': '#F4F4F6'
      }
    }
  },
  render: ({ items, ...args }) => renderComponentWithStyles(
    () => <justifi-payments-list></justifi-payments-list>,
    args.style
  )
};

