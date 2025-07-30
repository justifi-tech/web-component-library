import { codeExampleHead } from '../../../utils';
import { getSlotContent } from './slot-content';

export const codeExampleFull = `<!DOCTYPE html>
<html dir="ltr" lang="en">

${codeExampleHead(
  'justifi-modular-checkout',
  `<style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f8f9fa;
      color: #333;
      min-height: 100vh;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 40px;
      background-color: white;
      border-bottom: 1px solid #e0e0e0;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .back-arrow {
      font-size: 20px;
    }

    .brand-name {
      font-size: 18px;
      font-weight: 500;
    }

    .test-mode {
      background-color: #ff6b35;
      color: white;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .main-container {
      display: flex;
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
      gap: 40px;
    }

    .order-summary {
      flex: 0 0 40%;
      background-color: white;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .payment-form {
      flex: 0 0 60%;
      background-color: white;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .pay-header {
      margin-bottom: 30px;
    }

    .pay-title {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin: 0 0 10px 0;
    }

    .pay-amount {
      font-size: 32px;
      font-weight: bold;
      color: #333;
    }

    .product-item {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e0e0e0;
    }

    .product-image {
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

    .product-details {
      flex: 1;
    }

    .product-name {
      font-weight: 500;
      color: #333;
      margin-bottom: 5px;
    }

    .product-description {
      font-size: 14px;
      color: #666;
    }

    .product-price {
      font-weight: 600;
      color: #333;
    }

    .summary-breakdown {
      margin-bottom: 30px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 14px;
    }

    .summary-row.tax {
      align-items: center;
    }

    .tax-info {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .tax-icon {
      font-size: 12px;
      color: #666;
    }

    .tax-placeholder {
      color: #666;
    }

    .summary-row.total {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      padding-top: 10px;
      border-top: 1px solid #e0e0e0;
    }

    .footer {
      margin-top: auto;
      font-size: 12px;
      color: #666;
    }

    .powered-by {
      margin-bottom: 10px;
    }

    .stripe-text {
      font-weight: 600;
    }

    .footer-links {
      display: flex;
      gap: 20px;
    }

    .footer-link {
      color: #007bff;
      text-decoration: none;
    }

    .form-title {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin: 0 0 30px 0;
    }

    .form-field {
      margin-bottom: 25px;
    }

    .form-label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

    .form-input {
      width: 100%;
      padding: 12px 15px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 14px;
      background-color: white;
    }

    .form-select {
      width: 100%;
      padding: 12px 15px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 14px;
      background-color: white;
      color: #333;
    }

    .card-input-container {
      position: relative;
      margin-bottom: 15px;
    }

    .card-input {
      width: 100%;
      padding: 12px 15px;
      padding-right: 120px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 14px;
      background-color: white;
    }

    .card-icons {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      gap: 5px;
    }

    .card-icon {
      font-size: 12px;
      font-weight: bold;
    }

    .visa {
      color: #1a1f71;
    }

    .mastercard {
      color: #eb001b;
    }

    .amex {
      color: #006fcf;
    }

    .unionpay {
      color: #e60012;
    }

    .card-row {
      display: flex;
      gap: 15px;
    }

    .card-field {
      flex: 1;
    }

    .cvv-field {
      flex: 1;
      position: relative;
    }

    .cvv-input {
      width: 100%;
      padding: 12px 15px;
      padding-right: 40px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 14px;
      background-color: white;
    }

    .cvv-icon {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 12px;
      color: #666;
    }

    .manual-link {
      color: #007bff;
      text-decoration: none;
      font-size: 14px;
    }

    .checkbox-container {
      margin-bottom: 30px;
    }

    .checkbox-label {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      cursor: pointer;
    }

    .checkbox-input {
      margin-top: 2px;
    }

    .checkbox-text {
      font-size: 14px;
      color: #333;
      margin-bottom: 5px;
    }

    .checkbox-subtext {
      font-size: 12px;
      color: #666;
    }

    .pay-button {
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
  ${getSlotContent()}
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
