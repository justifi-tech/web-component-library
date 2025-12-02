import React from 'react';
import { ComponentExample } from './ComponentExample';
import mockBusinessFormSuccess from './mockData/mockBusinessFormSuccess.json';

export const BusinessFormExample: React.FC = () => {
  // Match API endpoint pattern: /v1/entities/business/{businessId}
  const businessEndpointPattern = /\/v1\/entities\/business\/[^/]+$/;

  return (
    <ComponentExample
      componentName="Business Form"
      componentTag="justifi-business-form"
      scriptUrl="https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js"
      mockData={mockBusinessFormSuccess}
      mockEndpoints={[
        {
          pattern: businessEndpointPattern,
          response: mockBusinessFormSuccess,
        },
      ]}
      componentProps={{
        'business-id': 'biz_xyz',
        'auth-token': 'mock-token',
      }}
      styles={`
        .component-example-children {
          background-color: white;
        }
      `}
    />
  );
};
