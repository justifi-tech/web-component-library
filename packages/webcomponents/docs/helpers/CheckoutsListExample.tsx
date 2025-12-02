import { registerComponentExample, createComponentExample } from './ComponentExample';
import mockGetCheckoutsListSuccess from './mockData/mockGetCheckoutsListSuccess.json';

// Register the component when module loads
if (typeof window !== 'undefined') {
  registerComponentExample();
}

// Match API endpoint pattern: /v1/checkouts (with Account header)
const checkoutsEndpointPattern = /\/v1\/checkouts/;

export const CheckoutsListExample = () => {
  return createComponentExample({
    componentName: 'Checkouts List',
    componentTag: 'justifi-checkouts-list',
    scriptUrl: 'https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js',
    mockEndpoints: [
      {
        pattern: checkoutsEndpointPattern.source,
        response: mockGetCheckoutsListSuccess,
      },
    ],
    componentProps: {
      'account-id': 'subaccount_1',
      'auth-token': 'mock-token',
    },
  });
};

