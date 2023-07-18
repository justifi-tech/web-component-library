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
        background-color: rgba(240, 240, 220, 1);
      }
      justifi-payments-list::part(pagination-bar) {
        background-color: rgba(240, 240, 220, 1);
      }
      justifi-payments-list::part(arrow) {
        --bs-btn-disabled-bg: rgba(200,200,100,1);
        --bs-btn-disabled-border-color: rgba(200,200,100,1);
        --bs-btn-bg: rgba(200,180,150,1);
        --bs-btn-hover-bg: rgba(250,250,150,1);
        --bs-btn-border-color: lightblue;
      }
      justifi-payments-list::part(error-state) {
        color: red;
        background-color: rgba(220, 220, 220, 1);
      }
      justifi-payments-list::part(loading-state-cell) {
        background-color: rgba(220, 220, 220, 1);
      }
      justifi-payments-list::part(table-row) {
        background-color: rgba(170, 180, 220, 1);
      }
      justifi-payments-list::part(table-row-even) {
        background-color: rgba(100, 120, 190, 1);
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
