import { registerComponentExample, createComponentExample } from './ComponentExample';

// Register the component when module loads
if (typeof window !== 'undefined') {
  registerComponentExample();
}

export const TokenizePaymentMethodExample = () => {
  return createComponentExample({
    componentName: 'Tokenize Payment Method',
    componentTag: 'justifi-tokenize-payment-method',
    scriptUrl: 'https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js',
    mockEndpoints: [],
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

