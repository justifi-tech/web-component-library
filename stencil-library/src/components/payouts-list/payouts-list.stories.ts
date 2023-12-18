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
    this['auth-token'] = args['auth-token'] || process.env.PROXY_AUTH_TOKEN;
    this['account-id'] = args['account-id'] || process.env.EXAMPLE_PAYMENTS_ACCOUNT_ID;
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
      justifi-payouts-list::part(table-head-cell) {
        background-color: #F4F4F6;
      }
      justifi-payouts-list::part(pagination-bar) {
        background-color: #F4F4F6;
      }
      justifi-payouts-list::part(arrow) {
        --bs-btn-disabled-bg: #212529;
        --bs-btn-disabled-border-color: #212529;
        --bs-btn-bg: #212529;
        --bs-btn-border-color: #212529;
        --bs-btn-hover-bg: #fccc32;
        --bs-btn-hover-border-color: #fccc32;
      }
      justifi-payouts-list::part(error-state) {
        color: red;
        background-color: #EEEEF5;
      }
      justifi-payouts-list::part(loading-state-cell) {
        background-color: #EEEEF5;
      }
      justifi-payouts-list::part(table-row) {
        background-color: #EEEEF5;
      }
      justifi-payouts-list::part(table-row-even) {
        background-color: #F4F4F6;
      }
    </style>
  `
]
