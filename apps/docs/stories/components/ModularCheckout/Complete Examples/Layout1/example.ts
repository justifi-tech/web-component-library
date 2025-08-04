import { codeExampleHead } from '../../../../utils';
import { getSlotContentExample1 } from './slot-content';

export const codeExampleFull = `
<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead(
  'justifi-modular-checkout',
  `<style>
    /* ExampleOne Styles */
    .donation-container {
      display: flex;
      flex-direction: column;
      gap: 30px;
      max-width: 600px;
      margin: 0 auto;
      font-family: sans-serif;
      color: #333;
    }

    .donation-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      font-size: 16px;
      color: #666;
    }

    .payment-form-container {
      display: flex;
      flex-direction: column;
      gap: 15px;
      background-color: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .payment-header {
      display: flex;
      gap: 10px;
      align-items: center;
      margin-bottom: 20px;
      font-size: 16px;
      color: #333;
    }

    .radio-button {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #28a745;
      margin-right: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .radio-button-inner {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: white;
    }

    .payment-method-selection {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
    }

    .payment-method-card {
      flex: 1;
      border: 2px solid #007bff;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
      background-color: white;
      cursor: pointer;
    }

    .payment-method-card.selected {
      border: 2px solid #007bff;
    }

    .payment-method-card:not(.selected) {
      border: 1px solid #e0e0e0;
    }

    .payment-method-icon {
      font-size: 24px;
      margin-bottom: 8px;
      color: #007bff;
    }

    .payment-method-icon.cash-app {
      color: #00d632;
    }

    .payment-method-icon.bank {
      color: #666;
    }

    .payment-method-text {
      font-size: 14px;
      color: #333;
    }

    .card-form-container {
      margin-bottom: 20px;
    }

    .country-zip-container {
      display: flex;
      gap: 15px;
    }

    .country-field {
      flex: 1;
    }

    .zip-field {
      flex: 1;
    }

    .form-label {
      display: block;
      margin-bottom: 10px;
      font-size: 1.1rem;
      color: #333;
      font-weight: 500;
    }

    .form-select {
      width: 100%;
      padding: 0.475rem 0.75rem;
      padding-right: 2.5rem;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 1rem;
      background-color: white;
      color: #333;
      /* Reset Safari default styles */
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      /* Ensure consistent styling */
      font-family: inherit;
      line-height: 1.5;
      /* Remove Safari's default focus outline */
      outline: none;
      /* Custom dropdown arrow */
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
      background-size: 1em;
    }

    /* Custom dropdown arrow for webkit browsers */
    .form-select::-ms-expand {
      display: none;
    }

    .submit-button {
      width: 100%;
      padding: 15px;
      background-color: #28a745;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
    }
  </style>`
)}

<body>
  <justifi-modular-checkout
    auth-token="authToken"
    account-id="acc_123"
    checkout-id="cho_123"
    save-payment-method="true"
  >
    ${getSlotContentExample1()}
  </justifi-modular-checkout>
</body>

<script>
  (function() {
    const modularCheckout = document.querySelector('justifi-modular-checkout');
    const submitButton = document.querySelector('#submit-button');
    
    // Submit checkout
    submitButton.addEventListener('click', async () => {
      await modularCheckout.submitCheckout();
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
  })();
</script>
</html>
`;
