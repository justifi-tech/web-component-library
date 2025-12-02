import React from 'react';
import { ComponentExample } from './ComponentExample';
import mockGrossVolumeReportSuccess from './mockData/mockGrossVolumeReportSuccess.json';

export const GrossPaymentChartExample: React.FC = () => {
  // Match API endpoint pattern: /v1/account/{accountId}/reports/gross_volume
  const grossVolumeEndpointPattern = /\/v1\/account\/[^/]+\/reports\/gross_volume/;

  return (
    <ComponentExample
      componentName="Gross Payment Chart"
      componentTag="justifi-gross-payment-chart"
      scriptUrl="https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js"
      mockData={mockGrossVolumeReportSuccess}
      mockEndpoints={[
        {
          pattern: grossVolumeEndpointPattern,
          response: mockGrossVolumeReportSuccess,
        },
      ]}
      componentProps={{
        'account-id': 'acc_1A2B3C4D5E6F7G8H9I0J',
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

