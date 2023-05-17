export default {
  title: 'Components/PaymentsList',
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
