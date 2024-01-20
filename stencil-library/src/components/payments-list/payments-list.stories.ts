import { config } from '../../../config';

export default {
  title: 'Components/PaymentsList',
  component: 'justifi-payments-list',
  parameters: {},
  decorators: [
    (Story) => `
      ${Story()}
      <script>
        window.addEventListener('payment-row-clicked', (e) => {
          console.log(e);
        })
      </script>
    `
  ]
};

class PaymentsListArgs {
  'auth-token': string;
  'account-id': string;

  constructor(args) {
    this['auth-token'] = args['auth-token'] || config.proxyAuthToken;
    this['account-id'] = args['account-id'] || config.exampleAccountId;
  }
}

const Template = (args: PaymentsListArgs) => {
  return (`
    <justifi-payments-list
      data-testid="justifi-payments-list"
      auth-token="${args['auth-token']}"
      account-id="${args['account-id']}"
    />
  `);
};

export const Basic = Template.bind({});
Basic.args = new PaymentsListArgs({});

export const Styled = Template.bind({});
Styled.args = new PaymentsListArgs({});
Styled.decorators = [
  (Story) => `
    ${Story()}
    <style>
    justifi-payments-list::part(table-head) {}
    justifi-payments-list::part(table-head-row) {}
    justifi-payments-list::part(table-head-cell) {
      background-color: #fff;
      font-weight: 600;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    justifi-payments-list::part(table-body) {}
    justifi-payments-list::part(table-row) {}
    justifi-payments-list::part(table-row):hover {
      cursor: pointer;
    }
    justifi-payments-list::part(table-row-even) {}
    justifi-payments-list::part(table-row-odd) {}
    justifi-payments-list::part(table-cell) {
      background-color: transparent;
      font-weight: normal;
      font-size: 0.8rem;
    }
    justifi-payments-list::part(loading-state-cell) {}
    justifi-payments-list::part(loading-state-spinner) {
      color: #ccc;
    }
    justifi-payments-list::part(error-state) {}
    justifi-payments-list::part(empty-state) {}
    justifi-payments-list::part(pagination-bar) {
      background-color: #fff;
      border-bottom: none;
    }
    justifi-payments-list::part(page-button) {
      border: none;
      background-color: transparent;
      text-transform: uppercase;
      font-weight: normal;
      font-size: 0.8rem;
    }
    justifi-payments-list::part(page-button-disabled) {
      opacity: 0.5;
      cursor: not-allowed;
    }
    justifi-payments-list::part(page-arrow) {
      display: none;
    }
    justifi-payments-list::part(page-button-text) {}
  </style>
  `
];
