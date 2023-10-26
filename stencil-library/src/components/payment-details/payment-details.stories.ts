import config from '../../../config';

export default {
  title: 'Pre-release Components/PaymentDetails',
  component: 'justifi-payment-details',
  parameters: {},
};

class PaymentDetailsArgs {
  'auth-token': string;
  'payment-id': string;

  constructor(args) {
    this['auth-token'] = args['auth-token'] || config.authToken;
    this['payment-id'] = args['payment-id'] || 'py_76nDkjHlXOEFQue5o3tzMj';
  }
}

const Template = (args: PaymentDetailsArgs) => {
  return (`
    <justifi-payment-details
      data-testid="justifi-payment-details"
      auth-token="${args['auth-token']}"
      payment-id="${args['payment-id']}"
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
      justifi-payment-details::part(detail-head) {
        background-color: rgba(100, 200, 250, 0.2);
        border-left: 4px solid rgba(100, 200, 250, 1);
      }
      justifi-payment-details::part(detail-info-item-title),
      justifi-payment-details::part(detail-method-item-title) {
        border-radius: 3px;
        background-color: rgba(0, 0, 0, 0.8);
        text-align: center;
        padding: 0 10px;
        color: white !important;
      }
      justifi-payment-details::part(detail-metadata) {
        background-color: rgba(100,100,100,0.2)
      }
    </style>
  `
]
