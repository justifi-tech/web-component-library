import React from 'react';
import { ComponentExample } from './ComponentExample';
import mockTerminalsListSuccess from './mockData/mockTerminalsListSuccess.json';

export const TerminalsListExample: React.FC = () => {
  // Match API endpoint pattern: /v1/terminals (with Account header)
  const terminalsEndpointPattern = /\/v1\/terminals/;

  return (
    <ComponentExample
      componentName="Terminals List"
      componentTag="justifi-terminals-list"
      scriptUrl="https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js"
      mockData={mockTerminalsListSuccess}
      mockEndpoints={[
        {
          pattern: terminalsEndpointPattern,
          response: mockTerminalsListSuccess,
        },
      ]}
      componentProps={{
        'account-id': 'subaccount_1',
        'auth-token': 'mock-token',
      }}
    />
  );
};

