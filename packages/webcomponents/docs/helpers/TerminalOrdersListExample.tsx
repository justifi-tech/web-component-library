import { registerComponentExample, createComponentExample } from './ComponentExample';
import mockTerminalOrdersListSuccess from './mockData/mockTerminalOrdersListSuccess.json';

// Register the component when module loads
if (typeof window !== 'undefined') {
  registerComponentExample();
}

// Match API endpoint pattern: /v1/terminals/orders
const terminalOrdersEndpointPattern = /\/v1\/terminals\/orders/;

export const TerminalOrdersListExample = () => {
  return createComponentExample({
    componentName: 'Terminal Orders List',
    componentTag: 'justifi-terminal-orders-list',
    scriptUrl: 'https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js',
    mockEndpoints: [
      {
        pattern: terminalOrdersEndpointPattern.source,
        response: mockTerminalOrdersListSuccess,
      },
    ],
    componentProps: {
      'account-id': 'acc_1A2B3C4D5E6F7G8H9I0J',
      'auth-token': 'mock-token',
    },
    styles: `
      .component-example-children {
        background-color: white;
        padding: 1rem;
      }
    `,
  });
};

