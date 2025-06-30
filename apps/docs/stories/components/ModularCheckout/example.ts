export const codeExample = `
<!DOCTYPE html>
<html dir="ltr" lang="en">

<justifi-modular-checkout
  auth-token="authToken"
  account-id="acc_123"
  checkout-id="cho_123"  
  save-payment-method="true"
>
  <justifi-checkout-summary />
  <justifi-card-form />
  <justifi-billing-information-form />
  <button id="submit-button">
    Submit Checkout
  </button>
</justifi-modular-checkout>

<button id="validate-button">Validate Form</button>

<script>
  (function() {
    const modularCheckout = document.querySelector('justifi-modular-checkout');
    const submitButton = document.querySelector('#submit-button');
    const validateButton = document.querySelector('#validate-button');
    
    // Submit checkout
    submitButton.addEventListener('click', async () => {
      await modularCheckout.submitCheckout();
      // You can also pass billing information:
      // await modularCheckout.submitCheckout({
      //   name: "John Doe",
      //   address_line1: "123 Main St",
      //   address_city: "Anytown",
      //   address_state: "NY",
      //   address_postal_code: "12345"
      // });
    });

    // Validate form
    validateButton.addEventListener('click', async () => {
      const isValid = await modularCheckout.validate();
      console.log('Form is valid:', isValid);
    });


    // Handle checkout completion
    modularCheckout.addEventListener('submit-event', (event) => {
      console.log('Checkout completed successfully!', event.detail);
    });

    // Handle errors
    modularCheckout.addEventListener('error-event', (event) => {
      console.error('Checkout error:', event.detail);
    });

    // Handle payment method changes
    modularCheckout.addEventListener('payment-method-changed', (event) => {
      console.log('Selected payment method changed to:', event.detail);
    });

    // Examples of programmatically setting payment method
    // modularCheckout.setSelectedPaymentMethod('card');        // New card
    // modularCheckout.setSelectedPaymentMethod('bankAccount'); // New bank account
    // modularCheckout.setSelectedPaymentMethod('sezzle');      // Sezzle BNPL
    // modularCheckout.setSelectedPaymentMethod('pm_12345');    // Saved payment method by ID
  })();
</script>
`;
