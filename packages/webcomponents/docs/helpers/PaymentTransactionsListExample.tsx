import React from 'react';
import { ComponentExample } from './ComponentExample';
import mockPaymentTransactionsSuccess from './mockData/mockPaymentTransactionsSuccess.json';

export const PaymentTransactionsListExample: React.FC = () => {
  // Match API endpoint pattern: /v1/payments/{paymentId}/payment_balance_transactions
  const paymentTransactionsEndpointPattern = /\/v1\/payments\/[^/]+\/payment_balance_transactions/;

  return (
    <ComponentExample
      componentName="Payment Transactions List"
      componentTag="justifi-payment-transactions-list"
      scriptUrl="https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js"
      mockData={mockPaymentTransactionsSuccess}
      mockEndpoints={[
        {
          pattern: paymentTransactionsEndpointPattern,
          response: mockPaymentTransactionsSuccess,
        },
      ]}
      componentProps={{
        'payment-id': 'py_1A2B3C4D5E6F7G8H9I0J',
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

