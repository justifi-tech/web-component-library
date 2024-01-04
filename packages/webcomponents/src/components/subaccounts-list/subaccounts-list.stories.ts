import { config } from '../../../config';

export default {
  title: 'dev/Components/SubaccountsList',
  component: 'justifi-subaccounts-list',
  parameters: {},
  decorators: [
    (Story) => `
      ${Story()}
      <script>
        window.addEventListener('subaccount-row-clicked', (e) => {
          console.log(e);
        })
      </script>
    `
  ]
};

class SubaccountsListArgs {
  'auth-token': string;
  'account-id': string;

  constructor(args) {
    this['auth-token'] = args['auth-token'] || config.privateAuthToken;
    this['account-id'] = args['account-id'] || ''
  }
}

const Template = (args: SubaccountsListArgs) => {
  return (`
    <justifi-subaccounts-list
      data-testid="justifi-subaccounts-list"
      auth-token="${args['auth-token']}"
      account-id="${args['account-id']}"
    />
  `);
};

export const Basic = Template.bind({});
Basic.args = new SubaccountsListArgs({});

export const Styled = Template.bind({});
Styled.args = new SubaccountsListArgs({});
Styled.decorators = [
  (Story) => `
    ${Story()}
    <style>
      justifi-subaccounts-list::part(table-head-cell) {
        background-color: #F4F4F6;
      }
      justifi-subaccounts-list::part(pagination-bar) {
        background-color: #F4F4F6;
      }
      justifi-subaccounts-list::part(arrow) {
        --bs-btn-disabled-bg: #212529;
        --bs-btn-disabled-border-color: #212529;
        --bs-btn-bg: #212529;
        --bs-btn-border-color: #212529;
        --bs-btn-hover-bg: #fccc32;
        --bs-btn-hover-border-color: #fccc32;
      }
      justifi-subaccounts-list::part(error-state) {
        color: red;
        background-color: #EEEEF5;
      }
      justifi-subaccounts-list::part(loading-state-cell) {
        background-color: #EEEEF5;
      }
      justifi-subaccounts-list::part(table-row) {
        background-color: #EEEEF5;
      }
      justifi-subaccounts-list::part(table-row-even) {
        background-color: #F4F4F6;
      }
    </style>
  `
]
