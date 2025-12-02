import React from 'react';
import { ComponentExample } from './ComponentExample';
import mockGetCheckoutSuccess from './mockData/mockGetCheckoutSuccess.json';
import mockCheckoutCompleteSuccess from './mockData/mockCheckoutCompleteSuccess.json';

export const CheckoutExample: React.FC = () => {
  // Match API endpoint pattern: /v1/checkouts/{checkoutId}
  const checkoutEndpointPattern = /\/v1\/checkouts\/[^/]+$/;
  // Match API endpoint pattern: /v1/checkouts/{checkoutId}/complete
  const checkoutCompleteEndpointPattern = /\/v1\/checkouts\/[^/]+\/complete$/;

  return (
    <ComponentExample
      componentName="Checkout"
      componentTag="justifi-checkout"
      scriptUrl="https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js"
      mockData={mockGetCheckoutSuccess}
      mockEndpoints={[
        {
          pattern: checkoutEndpointPattern,
          response: mockGetCheckoutSuccess,
        },
        {
          pattern: checkoutCompleteEndpointPattern,
          response: mockCheckoutCompleteSuccess,
        },
      ]}
      componentProps={{
        'checkout-id': 'cho_qkHk4NXnSV0PVulNY4M8J',
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

