import { registerComponentExample, createComponentExample } from './ComponentExample';
import mockGetCheckoutSuccess from './mockData/mockGetCheckoutSuccess.json';
import mockCheckoutCompleteSuccess from './mockData/mockCheckoutCompleteSuccess.json';

// Register the component when module loads
if (typeof window !== 'undefined') {
  registerComponentExample();
}

// Match API endpoint pattern: /v1/checkouts/{checkoutId}
const checkoutEndpointPattern = /\/v1\/checkouts\/[^/]+$/;
// Match API endpoint pattern: /v1/checkouts/{checkoutId}/complete
const checkoutCompleteEndpointPattern = /\/v1\/checkouts\/[^/]+\/complete$/;

export const CheckoutExample = () => {
  return createComponentExample({
    componentName: 'Checkout',
    componentTag: 'justifi-checkout',
    scriptUrl: 'https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js',
    mockEndpoints: [
      {
        pattern: checkoutEndpointPattern.source,
        response: mockGetCheckoutSuccess,
      },
      {
        pattern: checkoutCompleteEndpointPattern.source,
        response: mockCheckoutCompleteSuccess,
      },
    ],
    componentProps: {
      'checkout-id': 'cho_qkHk4NXnSV0PVulNY4M8J',
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

