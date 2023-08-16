export default {
  title: 'dev/Components/PaymentDetails',
  component: 'justifi-payment-details',
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

class PaymentDetailsArgs {
  'auth-token': string;
  'payment-id': string;
  'client-id': string;

  constructor(args) {
    this['auth-token'] = args['auth-token'] || '';
    this['payment-id'] = args['payment-id'] || '';
    this['client-id'] = args['client-id'] || '';
  }
}

const Template = (args: PaymentDetailsArgs) => {
  return (`
    <justifi-payment-details
      data-testid="justifi-payment-details"
      auth-token="${args['auth-token']}"
      payment-id="${args['payment-id']}"
      client-id="${args['client-id']}"
    />
  `);
};

export const Basic = Template.bind({});
Basic.args = new PaymentDetailsArgs({});

export const Styled = Template.bind({});
Styled.args = new PaymentDetailsArgs({});
Styled.decorators = [
  (Story) => `
    ${Story()}
    <style>
      justifi-payment-details::part(payment-head) {
        background-color: rgba(100, 200, 250, 0.2);
        border-left: 4px solid rgba(100, 200, 250, 1);
      }
      justifi-payment-details::part(payment-info-item-title),
      justifi-payment-details::part(payment-method-item-title) {
        border-radius: 3px;
        background-color: rgba(0, 0, 0, 0.8);
        text-align: center;
        padding: 0 10px;
        color: white !important;
      }
      justifi-payment-details::part(payment-metadata) {
        background-color: rgba(100,100,100,0.2)
      }
    </style>
  `
]
