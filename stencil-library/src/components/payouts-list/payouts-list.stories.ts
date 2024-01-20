import { config } from '../../../config';

export default {
  title: 'Components/PayoutsList',
  component: 'justifi-payouts-list',
  parameters: {},
  decorators: [
    (Story) => `
      ${Story()}
      <script>
        window.addEventListener('payout-row-clicked', (e) => {
          console.log(e);
        })
      </script>
    `
  ]
};

class PayoutsListArgs {
  'auth-token': string;
  'account-id': string;

  constructor(args) {
    this['auth-token'] = args['auth-token'] || config.proxyAuthToken;
    this['account-id'] = args['account-id'] || config.exampleAccountId;
  }
}

const Template = (args: PayoutsListArgs) => {
  return (`
    <justifi-payouts-list
      data-testid="justifi-payouts-list"
      auth-token="${args['auth-token']}"
      account-id="${args['account-id']}"
    />
  `);
};

export const Basic = Template.bind({});
Basic.args = new PayoutsListArgs({});

export const Styled = Template.bind({});
Styled.args = new PayoutsListArgs({});
Styled.decorators = [
  (Story) => `
    ${Story()}
    <style>
    justifi-payouts-list::part(table-head) {}
    justifi-payouts-list::part(table-head-row) {}
    justifi-payouts-list::part(table-head-cell) {
      background-color: #fff;
      font-weight: 600;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    justifi-payouts-list::part(table-body) {}
    justifi-payouts-list::part(table-row) {}
    justifi-payouts-list::part(table-row):hover {
      cursor: pointer;
    }
    justifi-payouts-list::part(table-row-even) {}
    justifi-payouts-list::part(table-row-odd) {}
    justifi-payouts-list::part(table-cell) {
      background-color: transparent;
      font-weight: normal;
      font-size: 0.8rem;
    }
    justifi-payouts-list::part(loading-state-cell) {}
    justifi-payouts-list::part(loading-state-spinner) {
      color: #ccc;
    }
    justifi-payouts-list::part(error-state) {}
    justifi-payouts-list::part(empty-state) {}
    justifi-payouts-list::part(pagination-bar) {
      background-color: #fff;
      border-bottom: none;
    }
    justifi-payouts-list::part(page-button) {
      border: none;
      background-color: transparent;
      text-transform: uppercase;
      font-weight: normal;
      font-size: 0.8rem;
    }
    justifi-payouts-list::part(page-button-disabled) {
      opacity: 0.5;
      cursor: not-allowed;
    }
    justifi-payouts-list::part(page-arrow) {
      display: none;
    }
    justifi-payouts-list::part(page-button-text) {}
  </style>
  `
]
