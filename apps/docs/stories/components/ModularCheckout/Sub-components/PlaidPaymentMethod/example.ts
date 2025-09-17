import { codeExampleHead } from '../../../../utils';

export const codeExampleFull = `
<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead(
  'justifi-plaid-payment-method',
  `<style>
      /** These are the available parts for styling the component. */
      ::part(text) {
        /* text styles */
      }

      ::part(text-danger) {
        /* text danger styles */
      }
      
      ::part(label) {
        /* label styles */
      }

      ::part(input-radio) {
        /* input radio styles */
      }

      ::part(input-radio-focused) {
        /* input radio focused styles */
      }

      ::part(input-radio-checked) {
        /* input radio checked styles */
      }

      ::part(input-radio-checked-focused) {
        /* input radio checked focused styles */
      }

      ::part(input-radio-invalid) {
        /* input radio invalid styles */
      }
    </style>`
)}

<body>
  <justifi-modular-checkout
    auth-token="authToken"
    checkout-id="ch_123"  
  >
    <justifi-plaid-payment-method />
  </justifi-modular-checkout>
</body>

<script>
  (function() {
    const modularCheckout = document.querySelector('justifi-modular-checkout');

    modularCheckout?.addEventListener('plaidError', (event) => {
      console.warn('Plaid error', event.detail);
    });

    modularCheckout?.addEventListener('plaidErrorRecovered', (event) => {
      console.log('Plaid recovered', event.detail);
    });
  })();
</script>
</html>
`;
