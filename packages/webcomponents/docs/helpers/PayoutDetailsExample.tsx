import { registerComponentExample, createComponentExample } from './ComponentExample';
import mockPayoutDetailsSuccess from './mockData/mockPayoutDetailsSuccess.json';

// Register the component when module loads
if (typeof window !== 'undefined') {
  registerComponentExample();
}

// Match API endpoint pattern: /v1/payouts/{payoutId}
const payoutEndpointPattern = /\/v1\/payouts\/[^/]+$/;

export const PayoutDetailsExample = () => {
  return createComponentExample({
    componentName: 'Payout Details',
    componentTag: 'justifi-payout-details',
    scriptUrl: 'https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js',
    mockEndpoints: [
      {
        pattern: payoutEndpointPattern.source,
        response: mockPayoutDetailsSuccess,
      },
    ],
    componentProps: {
      'payout-id': 'po_17745yESnHyEgWNeunmhmR',
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

