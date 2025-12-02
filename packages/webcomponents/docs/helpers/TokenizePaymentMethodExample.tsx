import React from 'react';
import { ComponentExample } from './ComponentExample';

export const TokenizePaymentMethodExample: React.FC = () => {
  return (
    <ComponentExample
      componentName="Tokenize Payment Method"
      componentTag="justifi-tokenize-payment-method"
      scriptUrl="https://cdn.jsdelivr.net/npm/@justifi/webcomponents@latest/dist/webcomponents/webcomponents.esm.js"
      mockData={{}}
      mockEndpoints={[]}
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

