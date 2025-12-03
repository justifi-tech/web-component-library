import React from 'react';
import { ComponentExample } from './ComponentExample';
import mockPayoutsSuccess from './mockData/mockPayoutsSuccess.json';
import { getWebcomponentsVersion } from '@justifi/webcomponents/docs/helpers';

export const PayoutsListExample: React.FC = () => {
  // Match API endpoint pattern: /v1/account/{accountId}/payouts
  const payoutsEndpointPattern = /\/v1\/account\/[^/]+\/payouts/;

  return (
    <ComponentExample
      componentName="Payouts List"
      componentTag="justifi-payouts-list"
      scriptUrl={`https://cdn.jsdelivr.net/npm/@justifi/webcomponents@${getWebcomponentsVersion()}/dist/webcomponents/webcomponents.esm.js`}
      mockData={mockPayoutsSuccess}
      mockEndpoints={[
        {
          pattern: payoutsEndpointPattern,
          response: mockPayoutsSuccess,
        },
      ]}
      componentProps={{
        'account-id': 'subaccount_1',
        'auth-token': 'mock-token',
      }}
    />
  );
};

