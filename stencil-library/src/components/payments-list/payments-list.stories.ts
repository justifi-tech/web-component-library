export default {
  title: 'dev/Components/PaymentsList',
  component: 'justifi-payments-list',
  parameters: {},
  argTypes: {
    'client-id': {
      control: 'text',
      table: {
        category: 'props',
      }
    },
  },
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
  'client-id': string;

  constructor(args) {
    this['auth-token'] = args['auth-token'] || '';
    this['account-id'] = args['account-id'] || '';
    this['client-id'] = args['client-id'] || '';
  }
}

const Template = (args: PaymentsListArgs) => {
  return (`
    <justifi-payments-list
      data-testid="justifi-payments-list"
      auth-token="${args['auth-token']}"
      account-id="${args['account-id']}"
      client-id="${args['client-id']}"
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
      justifi-payments-list::part(table-head-cell) {
        background-color: #F4F4F6;
      }
      justifi-payments-list::part(pagination-bar) {
        background-color: #F4F4F6;
      }
      justifi-payments-list::part(arrow) {
        --bs-btn-disabled-bg: #212529;
        --bs-btn-disabled-border-color: #212529;
        --bs-btn-bg: #212529;
        --bs-btn-border-color: #212529;
        --bs-btn-hover-bg: #fccc32;
        --bs-btn-hover-border-color: #fccc32;
      }
      justifi-payments-list::part(error-state) {
        color: red;
        background-color: #EEEEF5;
      }
      justifi-payments-list::part(loading-state-cell) {
        background-color: #EEEEF5;
      }
      justifi-payments-list::part(table-row) {
        background-color: #EEEEF5;
      }
      justifi-payments-list::part(table-row-even) {
        background-color: #F4F4F6;
      }
    </style>
  `
]

export const Contained = Template.bind({});
Contained.decorators = [
  (Story) => `
    <div style="position: relative; width: 900px; height: 300px; overflow-x: hidden;">
      ${Story()}
    </div>
  `
]
Contained.args = new PaymentsListArgs({});
