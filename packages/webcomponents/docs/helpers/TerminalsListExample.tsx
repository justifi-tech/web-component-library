import { registerComponentExample, createComponentExample } from './ComponentExample';
import mockTerminalsListSuccess from './mockData/mockTerminalsListSuccess.json';

// Register the component when module loads
if (typeof window !== 'undefined') {
  registerComponentExample();
}

// Match API endpoint pattern: /v1/terminals (with Account header)
const terminalsEndpointPattern = /\/v1\/terminals/;

export const TerminalsListExample = () => {
  return createComponentExample({
    componentName: 'Terminals List',
    componentTag: 'justifi-terminals-list',
    scriptUrl: 'https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js',
    mockEndpoints: [
      {
        pattern: terminalsEndpointPattern.source,
        response: mockTerminalsListSuccess,
      },
    ],
    componentProps: {
      'account-id': 'subaccount_1',
      'auth-token': 'mock-token',
    },
  });
};

