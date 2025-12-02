import { registerComponentExample, createComponentExample } from './ComponentExample';
import mockPaymentDetailSuccess from './mockData/mockPaymentDetailSuccess.json';

// Register the component when module loads
if (typeof window !== 'undefined') {
  registerComponentExample();
}

// Match API endpoint pattern: /v1/payments/{paymentId}
const paymentEndpointPattern = /\/v1\/payments\/[^/]+$/;

export const PaymentDetailsExample = () => {
  return createComponentExample({
    componentName: 'Payment Details',
    componentTag: 'justifi-payment-details',
    scriptUrl: 'https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js',
    mockEndpoints: [
      {
        pattern: paymentEndpointPattern.source,
        response: mockPaymentDetailSuccess,
      },
    ],
    componentProps: {
      'payment-id': 'py_1NNeEnf4FbelxDCQN2RHcE',
      'auth-token': 'mock-token',
      'account-id': 'acc_5Et9iXrSSAZR2KSouQGAWi',
    },
    styles: `
      .component-example-children {
        background-color: white;
      }
    `,
  });
};

