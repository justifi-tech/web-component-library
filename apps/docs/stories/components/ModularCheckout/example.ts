export const codeExample = `
<!DOCTYPE html>
<html dir="ltr" lang="en">

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
`;
