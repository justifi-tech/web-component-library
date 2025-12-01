import React from 'react';
import { ComponentExample } from './ComponentExample';
import mockPaymentDetailSuccess from './mockData/mockPaymentDetailSuccess.json';
import { getWebcomponentsVersion } from '@justifi/webcomponents/docs/helpers';

export const PaymentDetailsExample: React.FC = () => {
  // Match API endpoint pattern: /v1/payments/{paymentId}
  const paymentEndpointPattern = /\/v1\/payments\/[^/]+$/;

  return (
    <ComponentExample
      componentName="Payment Details"
      componentTag="justifi-payment-details"
      scriptUrl={`https://cdn.jsdelivr.net/npm/@justifi/webcomponents@${getWebcomponentsVersion()}/dist/webcomponents/webcomponents.esm.js`}
      mockData={mockPaymentDetailSuccess}
      mockEndpoints={[
        {
          pattern: paymentEndpointPattern,
          response: mockPaymentDetailSuccess,
        },
      ]}
      componentProps={{
        'payment-id': 'py_1NNeEnf4FbelxDCQN2RHcE',
        'auth-token': 'mock-token',
        'account-id': 'acc_5Et9iXrSSAZR2KSouQGAWi',
      }}
    />
  );
};

