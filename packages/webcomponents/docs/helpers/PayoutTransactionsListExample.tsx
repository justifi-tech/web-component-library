import { registerComponentExample, createComponentExample } from './ComponentExample';
import mockPayoutTransactionsSuccess from './mockData/mockPayoutTransactionsSuccess.json';

// Register the component when module loads
if (typeof window !== 'undefined') {
  registerComponentExample();
}

// Match API endpoint pattern: /v1/balance_transactions
const payoutTransactionsEndpointPattern = /\/v1\/balance_transactions/;

export const PayoutTransactionsListExample = () => {
  return createComponentExample({
    componentName: 'Payout Transactions List',
    componentTag: 'justifi-payout-transactions-list',
    scriptUrl: 'https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js',
    mockEndpoints: [
      {
        pattern: payoutTransactionsEndpointPattern.source,
        response: mockPayoutTransactionsSuccess,
      },
    ],
    componentProps: {
      'payout-id': 'po_1A2B3C4D5E6F7G8H9I0J',
      'auth-token': 'mock-token',
    },
    styles: `
      .component-example-children {
        background-color: white;
        padding: 1rem;
      }
    `,
  });
};

