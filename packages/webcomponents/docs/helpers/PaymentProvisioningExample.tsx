import { registerComponentExample, createComponentExample } from './ComponentExample';
import mockBusinessDetails from './mockData/mockBusinessDetails.json';
import mockBusinessProvisioningSuccess from './mockData/mockBusinessProvisioningSuccess.json';

// Register the component when module loads
if (typeof window !== 'undefined') {
  registerComponentExample();
}

// Match API endpoint pattern: /v1/entities/business/{businessId}
const businessEndpointPattern = /\/v1\/entities\/business\/[^/]+$/;
// Match API endpoint pattern: /v1/entities/provisioning
const provisioningEndpointPattern = /\/v1\/entities\/provisioning$/;

export const PaymentProvisioningExample = () => {
  return createComponentExample({
    componentName: 'Payment Provisioning',
    componentTag: 'justifi-payment-provisioning',
    scriptUrl: 'https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js',
    mockEndpoints: [
      {
        pattern: businessEndpointPattern.source,
        response: mockBusinessDetails,
      },
      {
        pattern: provisioningEndpointPattern.source,
        response: mockBusinessProvisioningSuccess,
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
        padding: 1rem;
      }
    `,
  });
};

