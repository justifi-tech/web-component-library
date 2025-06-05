import { codeExampleHead } from '../../utils';

export const codeExampleFull = `
<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead(
  'justifi-sezzle-payment-method',
  `<style>
      /** These are the available parts for styling the component. */
      ::part(text) {
        // text styles
      }

      ::part(text-danger) {
        // text danger styles
      }
      
      ::part(label) {
        // label styles
      }

      ::part(input-radio) {
        // input radio styles
      }

      ::part(input-radio-focused) {
        // input radio focused styles
      }

      ::part(input-radio-checked) {
        // input radio checked styles
      }

      ::part(input-radio-checked-focused) {
        // input radio checked focused styles
      }

      ::part(input-radio-invalid) {
        // input radio invalid styles
      }
    </style>`
)}

<body>
  <justifi-modular-checkout
    auth-token="authToken"
    account-id="acc_123"
    checkout-id="ch_123"  
  >
    <justifi-sezzle-payment-method />
  </justifi-modular-checkout>
</body>

<script>
  (function() {
    const modularCheckout = document.querySelector('justifi-modular-checkout');
    const submitButton = document.querySelector('#submit-button');

    submitButton.addEventListener('click', () => {
      modularCheckout.submitCheckout();
    });

    modularCheckout.addEventListener('error-event', (event) => {
      console.error(event.detail);
    });

    document.addEventListener('checkout-complete-event', (event) => {
      console.log('Checkout completed successfully!', event.detail);
    });
  })();
</script>
</html>
`;
