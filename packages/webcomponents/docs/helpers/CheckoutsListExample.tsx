import React from 'react';
import { ComponentExample } from './ComponentExample';
import mockGetCheckoutsListSuccess from './mockData/mockGetCheckoutsListSuccess.json';
import { getWebcomponentsVersion } from '@justifi/webcomponents/docs/helpers';

export const CheckoutsListExample: React.FC = () => {
  // Match API endpoint pattern: /v1/checkouts (with Account header)
  const checkoutsEndpointPattern = /\/v1\/checkouts/;

  return (
    <ComponentExample
      componentName="Checkouts List"
      componentTag="justifi-checkouts-list"
      scriptUrl={`https://cdn.jsdelivr.net/npm/@justifi/webcomponents@${getWebcomponentsVersion()}/dist/webcomponents/webcomponents.esm.js`}
      mockData={mockGetCheckoutsListSuccess}
      mockEndpoints={[
        {
          pattern: checkoutsEndpointPattern,
          response: mockGetCheckoutsListSuccess,
        },
      ]}
      componentProps={{
        'account-id': 'subaccount_1',
        'auth-token': 'mock-token',
      }}
    />
  );
};

