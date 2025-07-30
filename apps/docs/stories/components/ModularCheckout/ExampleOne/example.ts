import { codeExampleHead } from '../../../utils';
import { getSlotContent } from './slot-content';

export const codeExampleFull = `
<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead(
  'justifi-modular-checkout',
  `<style>
    ::part(font-family) {
      font-family: sans-serif;
    }

    ::part(color) {
      color: #333;
    }

    ::part(background-color) {
      background-color: transparent;
    }

    ::part(input) {
      border-color: #e0e0e0;
      border-width: 1px;
      border-radius: 4px;
      box-shadow: none;
      font-size: 14px;
      font-weight: normal;
      line-height: 1.5;
      padding: 12px;
    }

    ::part(input-focused) {
      border-color: #007bff;
      box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25);
    }

    ::part(input-invalid) {
      border-color: #dc3545;
      box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
    }

    ::part(input-invalid-and-focused) {
      box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
      border-color: #dc3545;
    }

    ::part(label) {
      font-size: 14px;
      color: #333;
      font-weight: 500;
      margin-bottom: 8px;
    }

    /* Additional styles for the example */
    .donation-container {
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
      background-color: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .payment-header {
      display: flex;
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

    .payment-methods {
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

    .payment-method-card-inactive {
      flex: 1;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
      background-color: white;
      cursor: pointer;
    }

    .payment-method-icon {
      font-size: 24px;
      margin-bottom: 8px;
      color: #007bff;
    }

    .payment-method-icon-cash {
      font-size: 24px;
      margin-bottom: 8px;
      color: #00d632;
    }

    .payment-method-icon-bank {
      font-size: 24px;
      margin-bottom: 8px;
      color: #666;
    }

    .payment-method-label {
      font-size: 14px;
      color: #333;
    }

    .card-form-container {
      margin-bottom: 20px;
    }

    .form-row {
      display: flex;
      gap: 15px;
    }

    .form-field {
      flex: 1;
    }

    .country-label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }

    .country-select {
      width: 100%;
      padding: 12px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      font-size: 14px;
      background-color: white;
      color: #333;
    }

    .donate-button {
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
    ${getSlotContent()}
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
