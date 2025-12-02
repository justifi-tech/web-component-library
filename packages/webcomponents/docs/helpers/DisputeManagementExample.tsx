import React from 'react';
import { ComponentExample } from './ComponentExample';
import mockDisputeResponse from './mockData/mockDisputeResponse.json';

export const DisputeManagementExample: React.FC = () => {
  // Match API endpoint pattern: /v1/disputes/{disputeId}
  const disputeEndpointPattern = /\/v1\/disputes\/[^/]+$/;

  return (
    <ComponentExample
      componentName="Dispute Management"
      componentTag="justifi-dispute-management"
      scriptUrl="https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js"
      mockData={mockDisputeResponse}
      mockEndpoints={[
        {
          pattern: disputeEndpointPattern,
          response: mockDisputeResponse,
        },
      ]}
      componentProps={{
        'dispute-id': 'dp_1A2B3C4D5E6F7G8H9I0J',
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

