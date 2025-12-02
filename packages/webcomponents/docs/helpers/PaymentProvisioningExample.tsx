import React from 'react';
import { ComponentExample } from './ComponentExample';
import mockBusinessDetails from './mockData/mockBusinessDetails.json';
import mockBusinessProvisioningSuccess from './mockData/mockBusinessProvisioningSuccess.json';

export const PaymentProvisioningExample: React.FC = () => {
  // Match API endpoint pattern: /v1/entities/business/{businessId}
  const businessEndpointPattern = /\/v1\/entities\/business\/[^/]+$/;
  // Match API endpoint pattern: /v1/entities/provisioning
  const provisioningEndpointPattern = /\/v1\/entities\/provisioning$/;

  return (
    <ComponentExample
      componentName="Payment Provisioning"
      componentTag="justifi-payment-provisioning"
      scriptUrl="https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js"
      mockData={mockBusinessProvisioningSuccess}
      mockEndpoints={[
        {
          pattern: businessEndpointPattern,
          response: mockBusinessDetails,
        },
        {
          pattern: provisioningEndpointPattern,
          response: mockBusinessProvisioningSuccess,
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
          padding: 1rem;
        }
      `}
    />
  );
};

