import { registerComponentExample, createComponentExample } from './ComponentExample';
import mockPayoutsSuccess from './mockData/mockPayoutsSuccess.json';

// Register the component when module loads
if (typeof window !== 'undefined') {
  registerComponentExample();
}

// Match API endpoint pattern: /v1/account/{accountId}/payouts
const payoutsEndpointPattern = /\/v1\/account\/[^/]+\/payouts/;

export const PayoutsListExample = () => {
  return createComponentExample({
    componentName: 'Payouts List',
    componentTag: 'justifi-payouts-list',
    scriptUrl: 'https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js',
    mockEndpoints: [
      {
        pattern: payoutsEndpointPattern.source,
        response: mockPayoutsSuccess,
      },
    ],
    componentProps: {
      'account-id': 'subaccount_1',
      'auth-token': 'mock-token',
    },
  });
};

