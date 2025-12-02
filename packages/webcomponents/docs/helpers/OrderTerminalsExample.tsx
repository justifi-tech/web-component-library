import React from 'react';
import { ComponentExample } from './ComponentExample';
import mockBusinessDetails from './mockData/mockBusinessDetails.json';
import mockOrderModelsSuccess from './mockData/mockOrderModelsSuccess.json';
import mockOrderTerminalsSuccess from './mockData/mockOrderTerminalsSuccess.json';

export const OrderTerminalsExample: React.FC = () => {
  // Match API endpoint pattern: /v1/entities/business/{businessId}
  const businessEndpointPattern = /\/v1\/entities\/business\/[^/]+$/;
  // Match API endpoint pattern: /v1/terminals/order_models
  const terminalModelsEndpointPattern = /\/v1\/terminals\/order_models$/;
  // Match API endpoint pattern: /v1/terminals/orders
  const orderTerminalsEndpointPattern = /\/v1\/terminals\/orders$/;

  return (
    <ComponentExample
      componentName="Order Terminals"
      componentTag="justifi-order-terminals"
      scriptUrl="https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js"
      mockData={mockOrderTerminalsSuccess}
      mockEndpoints={[
        {
          pattern: businessEndpointPattern,
          response: mockBusinessDetails,
        },
        {
          pattern: terminalModelsEndpointPattern,
          response: mockOrderModelsSuccess,
        },
        {
          pattern: orderTerminalsEndpointPattern,
          response: mockOrderTerminalsSuccess,
        },
      ]}
      componentProps={{
        'business-id': 'biz_xyz',
        'account-id': 'acc_xyz',
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

