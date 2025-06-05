import { codeExampleHead } from '../../utils';

export const codeExampleFull = `
<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead(
  'justifi-card-form',
  `<style>
      /** These are the available parts for styling the component. */
      ::part(skeleton) {
        // skeleton styles
      }
        
      ::part(label) {
        // label styles
      }

      ::part(input-invalid-and-focused) {
        // input invalid and focused styles
      }

      ::part(input-invalid) {
        // input invalid styles
      }

      ::part(input-focused) {
        // input focused styles
      }

      ::part(input) {
        // input styles
      }
    </style>`
)}

<body>
  <justifi-modular-checkout
    auth-token="authToken"
    account-id="acc_123"
    checkout-id="ch_123"  
    save-payment-method="true"
  >
    <justifi-card-form />
    <button id="submit-button">
      Submit Checkout
    </button>
  </justifi-modular-checkout>
</body>

<script>
  (function() {
    const checkoutWrapper = document.querySelector('justifi-modular-checkout');
    const submitButton = document.querySelector('#submit-button');

    submitButton.addEventListener('click', () => {
      checkoutWrapper.submitCheckout();
    });

    checkoutWrapper.addEventListener('error-event', (event) => {
      console.error(event.detail);
    });

    document.addEventListener('checkout-complete-event', (event) => {
      console.log('Checkout completed successfully!', event.detail);
    });
  })();
</script>
</html>
`;
