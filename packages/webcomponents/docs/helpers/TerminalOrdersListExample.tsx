import React from 'react';
import { ComponentExample } from './ComponentExample';
import mockTerminalOrdersListSuccess from './mockData/mockTerminalOrdersListSuccess.json';

export const TerminalOrdersListExample: React.FC = () => {
  // Match API endpoint pattern: /v1/terminals/orders
  const terminalOrdersEndpointPattern = /\/v1\/terminals\/orders/;

  return (
    <ComponentExample
      componentName="Terminal Orders List"
      componentTag="justifi-terminal-orders-list"
      scriptUrl="https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js"
      mockData={mockTerminalOrdersListSuccess}
      mockEndpoints={[
        {
          pattern: terminalOrdersEndpointPattern,
          response: mockTerminalOrdersListSuccess,
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

