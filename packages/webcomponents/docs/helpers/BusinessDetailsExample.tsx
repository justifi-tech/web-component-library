import { registerComponentExample, createComponentExample } from './ComponentExample';
import mockBusinessDetails from './mockData/mockBusinessDetails.json';

// Register the component when module loads
if (typeof window !== 'undefined') {
  registerComponentExample();
}

// Match API endpoint pattern: any origin + /v1/entities/business/{businessId}
const businessEndpointPattern = /\/v1\/entities\/business\/[^/]+$/;

export const BusinessDetailsExample = () => {
  return createComponentExample({
    componentName: 'Business Details',
    componentTag: 'justifi-business-details',
    scriptUrl: 'https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js',
    mockEndpoints: [
      {
        pattern: businessEndpointPattern.source,
        response: mockBusinessDetails,
      },
    ],
    componentProps: {
      'business-id': 'biz_xyz',
      'auth-token': 'mock-token',
      'account-id': 'acc_xyz',
    },
    styles: `
      .component-example-children {
        background-color: white;
      }
    `,
  });
};

