import { codeExampleHead } from '../../../../utils';
import { getSlotContentExample3 } from './slot-content';

export const codeExampleFull = `<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead(
  'justifi-modular-checkout',
  `<style>
    /* Checkout Layout Styles */

    .checkout-container * {
      display: block;
      box-sizing: border-box;
    }

    .checkout-container {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f8f9fa;
      color: #333;
      min-height: 100vh;
    }

    /* Header Bar */
    .checkout-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 40px;
      background-color: white;
      border-bottom: 1px solid #e0e0e0;
    }

    .checkout-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .checkout-back-arrow {
      font-size: 20px;
    }

    .checkout-brand-name {
      font-size: 18px;
      font-weight: 500;
    }

    /* Main Container */
    .checkout-main-container {
      display: flex;
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
      gap: 40px;
    }

    /* Left Column - Order Summary */
    .checkout-order-summary {
      display: flex;
      flex-direction: column;
      gap: 30px;
      flex: 0 0 45%;
      padding: 15px;
    }

    .checkout-pay-header {
      margin-bottom: 30px;
    }

    .checkout-pay-title {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin: 0 0 10px 0;
    }

    .checkout-pay-amount {
      font-size: 32px;
      font-weight: bold;
      color: #333;
    }

    .checkout-product-item {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e0e0e0;
    }

    .checkout-product-image {
      width: 60px;
      height: 80px;
      background-color: #f8f9fa;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #666;
    }

    .checkout-product-details {
      flex: 1;
    }

    .checkout-product-name {
      font-weight: 500;
      color: #333;
      margin-bottom: 5px;
    }

    .checkout-product-description {
      font-size: 14px;
      color: #666;
    }

    .checkout-product-price {
      font-weight: 600;
      color: #333;
    }

    .checkout-summary-breakdown {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 30px;
    }

    .checkout-summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 14px;
    }

    .checkout-summary-row.tax {
      align-items: center;
    }

    .checkout-tax-info {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .checkout-tax-icon {
      font-size: 12px;
      color: #666;
    }

    .checkout-tax-placeholder {
      color: #666;
    }

    .checkout-summary-row.total {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      padding-top: 10px;
      border-top: 1px solid #e0e0e0;
    }

    .checkout-footer {
      margin-top: auto;
      font-size: 12px;
      color: #666;
    }

    .checkout-powered-by {
      margin-bottom: 10px;
    }

    .checkout-justifi-text {
      font-weight: 600;
    }

    .checkout-footer-links {
      display: flex;
      gap: 20px;
    }

    .checkout-footer-link {
      color: #007bff;
      text-decoration: none;
    }

    /* Right Column - Payment Form */
    .checkout-form-field justifi-card-form {
      margin-bottom: 15px;
    }

    .checkout-payment-form {
      display: flex;
      flex-direction: column;
      gap: 15px;
      flex: 0 0 50%;
      background-color: white;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .checkout-form-title {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin: 0 0 30px 0;
    }

    .checkout-form-field {
      margin-bottom: 25px;
    }

    .checkout-form-label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

    .checkout-form-input {
      width: 100%;
      padding: 12px 15px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 14px;
      background-color: white;
    }

    .checkout-form-select {
      width: 100%;
      padding: 12px 15px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 14px;
      background-color: white;
      color: #333;
    }

    .checkout-manual-link {
      color: #007bff;
      text-decoration: none;
      font-size: 14px;
    }

    .checkout-checkbox-container {
      margin-bottom: 30px;
    }

    .checkout-checkbox-label {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      cursor: pointer;
    }

    .checkout-checkbox-input {
      margin-top: 2px;
    }

    .checkout-checkbox-text {
      font-size: 14px;
      color: #333;
      margin-bottom: 5px;
    }

    .checkout-checkbox-subtext {
      font-size: 12px;
      color: #666;
    }

    .checkout-pay-button {
      width: 100%;
      background-color: #007bff;
      color: white;
      border: none;
      padding: 15px;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
    }

    .checkout-pay-button:hover {
      background-color: #0056b3;
    }

    /* Web Component Parts Styling */
    ::part(font-family) {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    ::part(color) {
      color: #333;
    }

    ::part(background-color) {
      background-color: white;
    }

    ::part(input) {
      border-color: #e0e0e0;
      border-width: 1px;
      border-radius: 6px;
      border-style: solid;
      box-shadow: none;
      font-size: 14px;
      font-weight: normal;
      line-height: 1.5;
      padding: 12px 15px;
      background-color: white;
    }

    ::part(input-focused) {
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
    }

    ::part(input-invalid) {
      border-color: #dc3545;
      box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.1);
    }

    ::part(label) {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin-bottom: 8px;
    }

    ::part(button) {
      padding: 12px 15px;
      font-size: 14px;
      box-shadow: none;
      border-radius: 6px;
      line-height: 1.5;
      text-transform: none;
    }

    ::part(button-primary) {
      color: #ffffff;
      background-color: #007bff;
      border-color: #007bff;
    }

    ::part(button-primary):hover {
      background-color: #0056b3;
      border-color: #0056b3;
      color: #ffffff;
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
    ${getSlotContentExample3()}
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

</html>`;
