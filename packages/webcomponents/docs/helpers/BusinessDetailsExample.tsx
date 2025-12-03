import React from 'react';
import { ComponentExample } from './ComponentExample';
import mockBusinessDetails from './mockData/mockBusinessDetails.json';
import { getWebcomponentsVersion } from '@justifi/webcomponents/docs/helpers';

export const BusinessDetailsExample: React.FC = () => {
  // Match API endpoint pattern: any origin + /v1/entities/business/{businessId}
  const businessEndpointPattern = /\/v1\/entities\/business\/[^/]+$/;

  return (
    <ComponentExample
      componentName="Business Details"
      componentTag="justifi-business-details"
      scriptUrl={`https://cdn.jsdelivr.net/npm/@justifi/webcomponents@${getWebcomponentsVersion()}/dist/webcomponents/webcomponents.esm.js`}
      mockData={mockBusinessDetails}
      mockEndpoints={[
        {
          pattern: businessEndpointPattern,
          response: mockBusinessDetails,
        },
      ]}
      componentProps={{
        'business-id': 'biz_xyz',
        'auth-token': 'mock-token',
        'account-id': 'acc_xyz',
      }}
    />
  );
};

