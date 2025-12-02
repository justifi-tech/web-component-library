import { registerComponentExample, createComponentExample } from './ComponentExample';
import mockDisputeResponse from './mockData/mockDisputeResponse.json';

// Register the component when module loads
if (typeof window !== 'undefined') {
  registerComponentExample();
}

// Match API endpoint pattern: /v1/disputes/{disputeId}
const disputeEndpointPattern = /\/v1\/disputes\/[^/]+$/;

export const DisputeManagementExample = () => {
  return createComponentExample({
    componentName: 'Dispute Management',
    componentTag: 'justifi-dispute-management',
    scriptUrl: 'https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js',
    mockEndpoints: [
      {
        pattern: disputeEndpointPattern.source,
        response: mockDisputeResponse,
      },
    ],
    componentProps: {
      'dispute-id': 'dp_1A2B3C4D5E6F7G8H9I0J',
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

