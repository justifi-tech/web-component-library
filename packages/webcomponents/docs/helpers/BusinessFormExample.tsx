import { registerComponentExample, createComponentExample } from './ComponentExample';
import mockBusinessFormSuccess from './mockData/mockBusinessFormSuccess.json';

// Register the component when module loads
if (typeof window !== 'undefined') {
  registerComponentExample();
}

// Match API endpoint pattern: /v1/entities/business/{businessId}
const businessEndpointPattern = /\/v1\/entities\/business\/[^/]+$/;

export const BusinessFormExample = () => {
  return createComponentExample({
    componentName: 'Business Form',
    componentTag: 'justifi-business-form',
    scriptUrl: 'https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js',
    mockEndpoints: [
      {
        pattern: businessEndpointPattern.source,
        response: mockBusinessFormSuccess,
      },
    ],
    componentProps: {
      'business-id': 'biz_xyz',
      'auth-token': 'mock-token',
    },
    styles: `
      .component-example-children {
        background-color: white;
      }
    `,
  });
};
