import { config } from "../../../config";

export default {
  title: 'dev/Components/PaymentBalanceTransactions',
  component: 'justifi-payment-balance-transactions',
  parameters: {},
};

class PaymentBalanceTransactionsArgs {
  'auth-token': string;
  'payment-id': string;
  'account-id': string;

  'constructor'(args) {
    this['auth-token'] = args['auth-token'] || config.proxyAuthToken;
    this['payment-id'] = args['payment-id'] || config.examplePaymentId;
    this['account-id'] = args['account-id'] || config.exampleAccountId;
  }
}

const Template = (args: PaymentBalanceTransactionsArgs) => {
  return `
    <justifi-payment-balance-transactions
      data-testid="justifi-payment-balance-transactions"
      auth-token="${args['auth-token']}"
      payment-id="${args['payment-id']}"
      account-id="${args['account-id']}"
    />
  `;
};

export const Basic = Template.bind({});
Basic.args = new PaymentBalanceTransactionsArgs({});

export const Styled = Template.bind({});
Styled.args = new PaymentBalanceTransactionsArgs({});
Styled.decorators = [
  Story => `
    ${Story()}
  `,
];
