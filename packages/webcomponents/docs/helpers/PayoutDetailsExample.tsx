import React from 'react';
import { ComponentExample } from './ComponentExample';
import mockPayoutDetailsSuccess from './mockData/mockPayoutDetailsSuccess.json';

export const PayoutDetailsExample: React.FC = () => {
  // Match API endpoint pattern: /v1/payouts/{payoutId}
  const payoutEndpointPattern = /\/v1\/payouts\/[^/]+$/;

  return (
    <ComponentExample
      componentName="Payout Details"
      componentTag="justifi-payout-details"
      scriptUrl="https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js"
      mockData={mockPayoutDetailsSuccess}
      mockEndpoints={[
        {
          pattern: payoutEndpointPattern,
          response: mockPayoutDetailsSuccess,
        },
      ]}
      componentProps={{
        'payout-id': 'po_17745yESnHyEgWNeunmhmR',
        'auth-token': 'mock-token',
        'account-id': 'acc_5Et9iXrSSAZR2KSouQGAWi',
      }}
      styles={`
        .component-example-children {
          background-color: white;
        }
      `}
    />
  );
};

