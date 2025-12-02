import React from 'react';
import { ComponentExample } from './ComponentExample';
import mockPayoutTransactionsSuccess from './mockData/mockPayoutTransactionsSuccess.json';

export const PayoutTransactionsListExample: React.FC = () => {
  // Match API endpoint pattern: /v1/balance_transactions
  const payoutTransactionsEndpointPattern = /\/v1\/balance_transactions/;

  return (
    <ComponentExample
      componentName="Payout Transactions List"
      componentTag="justifi-payout-transactions-list"
      scriptUrl="https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js"
      mockData={mockPayoutTransactionsSuccess}
      mockEndpoints={[
        {
          pattern: payoutTransactionsEndpointPattern,
          response: mockPayoutTransactionsSuccess,
        },
      ]}
      componentProps={{
        'payout-id': 'po_1A2B3C4D5E6F7G8H9I0J',
        'auth-token': 'mock-token',
      }}
      styles={`
        .component-example-children {
          background-color: white;
          padding: 1rem;
        }
      `}
    />
  );
};

