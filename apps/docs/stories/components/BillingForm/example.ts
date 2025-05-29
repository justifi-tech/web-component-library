import { codeExampleHead } from '../../utils';

export const codeExampleFull = `
<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead(
  'justifi-billing-information-form',
  `<style>
      /** These are the available parts for styling the component. */
      ::part(billing-form) {
        // billing-form container styles
      }
        
      ::part(text-danger) {
        // used in the validation error text
      }
      
      ::part(label) {
        // label styles
      }

      ::part(input-disabled) {
        // input disabled styles
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

      ::part(tooltip) {
        // tooltip styles
      }

      ::part(tooltip-inner) {
        // tooltip container of the inner content
      }
      
      ::part(tooltip-icon) {
        // tooltip icon styles
      }
    </style>`
)}

<body>
  <justifi-checkout-wrapper
    auth-token="authToken"
    account-id="acc_123"
    checkout-id="ch_123"  
    save-payment-method="true"
  >
    <justifi-card-form />
    <justifi-billing-information-form />
    <button id="submit-button">
      Submit Checkout
    </button>
  </justifi-checkout-wrapper>
</body>

<script>
  (function() {
    const checkoutWrapper = document.querySelector('justifi-checkout-wrapper');
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
