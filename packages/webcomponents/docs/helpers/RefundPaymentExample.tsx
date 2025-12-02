import React from 'react';
import { ComponentExample } from './ComponentExample';
import mockPaymentDetailSuccess from './mockData/mockPaymentDetailSuccess.json';
import mockPostRefundSuccess from './mockData/mockPostRefundSuccess.json';

export const RefundPaymentExample: React.FC = () => {
  // Match API endpoint pattern: /v1/payments/{paymentId}
  const paymentEndpointPattern = /\/v1\/payments\/[^/]+$/;
  // Match API endpoint pattern: /v1/payments/{paymentId}/refunds
  const refundEndpointPattern = /\/v1\/payments\/[^/]+\/refunds$/;

  return (
    <ComponentExample
      componentName="Refund Payment"
      componentTag="justifi-refund-payment"
      scriptUrl="https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js"
      mockData={mockPostRefundSuccess}
      mockEndpoints={[
        {
          pattern: paymentEndpointPattern,
          response: mockPaymentDetailSuccess,
        },
        {
          pattern: refundEndpointPattern,
          response: mockPostRefundSuccess,
        },
      ]}
      componentProps={{
        'payment-id': 'py_1NNeEnf4FbelxDCQN2RHcE',
        'account-id': 'acc_5Et9iXrSSAZR2KSouQGAWi',
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

