import React from 'react';
import { ComponentExample } from './ComponentExample';
import mockPaymentsSuccess from './mockData/mockPaymentsSuccess.json';

export const PaymentsListExample: React.FC = () => {
  // Match API endpoint pattern: /v1/account/{accountId}/payments
  const paymentsEndpointPattern = /\/v1\/account\/[^/]+\/payments/;

  return (
    <ComponentExample
      componentName="Payments List"
      componentTag="justifi-payments-list"
      scriptUrl="https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js"
      mockData={mockPaymentsSuccess}
      mockEndpoints={[
        {
          pattern: paymentsEndpointPattern,
          response: mockPaymentsSuccess,
        },
      ]}
      componentProps={{
        'account-id': 'acc_1A2B3C4D5E6F7G8H9I0J',
        'auth-token': 'mock-token',
      }}
    />
  );
};

