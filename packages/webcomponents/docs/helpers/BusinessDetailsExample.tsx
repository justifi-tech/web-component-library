import React from 'react';
import { ComponentExample } from './ComponentExample';
import mockBusinessDetails from './mockData/mockBusinessDetails.json';

export const BusinessDetailsExample: React.FC = () => {
  // Match API endpoint pattern: any origin + /v1/entities/business/{businessId}
  const businessEndpointPattern = /\/v1\/entities\/business\/[^/]+$/;

  return (
    <ComponentExample
      componentName="Business Details"
      componentTag="justifi-business-details"
      scriptUrl="https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js"
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
      styles={`
        .component-example-children {
          background-color: white;
        }
      `}
    />
  );
};

