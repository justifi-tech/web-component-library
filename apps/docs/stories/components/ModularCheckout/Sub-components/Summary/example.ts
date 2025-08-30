import { codeExampleHead } from '../../../../utils';

export const codeExampleFull = `
<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead(
  'justifi-checkout-summary',
  `<style>
      /** These are the available parts for styling the component. */
      ::part(text) {
        // text styles
      }
    </style>`
)}

<body>
  <justifi-modular-checkout
    auth-token="authToken"
    checkout-id="ch_123"  
    save-payment-method="true"
  >
    <justifi-checkout-summary />
  </justifi-modular-checkout>
</body>
</html>
`;
