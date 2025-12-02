import { registerComponentExample, createComponentExample } from './ComponentExample';
import mockPaymentsSuccess from './mockData/mockPaymentsSuccess.json';

// Register the component when module loads
if (typeof window !== 'undefined') {
  registerComponentExample();
}

// Match API endpoint pattern: /v1/account/{accountId}/payments
const paymentsEndpointPattern = /\/v1\/account\/[^/]+\/payments/;

export const PaymentsListExample = () => {
  return createComponentExample({
    componentName: 'Payments List',
    componentTag: 'justifi-payments-list',
    scriptUrl: 'https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js',
    mockEndpoints: [
      {
        pattern: paymentsEndpointPattern.source,
        response: mockPaymentsSuccess,
      },
    ],
    componentProps: {
      'account-id': 'acc_1A2B3C4D5E6F7G8H9I0J',
      'auth-token': 'mock-token',
    },
  });
};

