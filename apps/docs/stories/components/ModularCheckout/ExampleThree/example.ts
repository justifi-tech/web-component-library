import { codeExampleHead } from '../../../utils';

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
  <!-- Header Bar -->
  <div class="header">
    <div class="brand">
      <span class="back-arrow">←</span>
      <span class="brand-name">JustiFi Store</span>
    </div>
    <div class="test-mode">TEST MODE</div>
  </div>

  <!-- Main Container -->
  <div class="main-container">
    <!-- Left Column - Order Summary -->
    <div class="order-summary">
      <!-- Pay Header -->
      <div class="pay-header">
        <h1 class="pay-title">Pay JustiFi Store</h1>
        <div class="pay-amount">$39.99</div>
      </div>

      <!-- Product Item -->
      <div class="product-item">
        <div class="product-image">📚</div>
        <div class="product-details">
          <div class="product-name">Fintech Deployhandbook Test</div>
          <div class="product-description">How to deploy Fintech app...</div>
        </div>
        <div class="product-price">$39.99</div>
      </div>

      <!-- Summary Breakdown -->
      <div class="summary-breakdown">
        <div class="summary-row">
          <span>Subtotal</span>
          <span>$39.99</span>
        </div>
        <div class="summary-row tax">
          <div class="tax-info">
            <span>Tax</span>
            <span class="tax-icon">ⓘ</span>
          </div>
          <span class="tax-placeholder">Enter address to calculate</span>
        </div>
        <div class="summary-row total">
          <span>Total due</span>
          <span>$39.99</span>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="powered-by">
          Powered by <span class="stripe-text">JustiFi</span>
        </div>
        <div class="footer-links">
          <a href="#" class="footer-link">Terms</a>
          <a href="#" class="footer-link">Privacy</a>
        </div>
      </div>
    </div>

    <!-- Right Column - Payment Form -->
    <div class="payment-form">
      <h2 class="form-title">Pay with card</h2>

      <!-- Email Field -->
      <div class="form-field">
        <label class="form-label">Email</label>
        <input type="email" placeholder="Enter your email" class="form-input" />
      </div>

      <!-- Card Information -->
      <div class="form-field">
        <label class="form-label">Debit/Credit Card information</label>
        <div class="card-input-container">
          <input type="text" placeholder="1234 1234 1234 1234" class="card-input" />
          <div class="card-icons">
            <span class="card-icon visa">VISA</span>
            <span class="card-icon mastercard">MC</span>
            <span class="card-icon amex">AMEX</span>
            <span class="card-icon unionpay">UP</span>
          </div>
        </div>
        <div class="card-row">
          <div class="card-field">
            <input type="text" placeholder="MM / YY" class="form-input" />
          </div>
          <div class="cvv-field">
            <input type="text" placeholder="CVC" class="cvv-input" />
            <div class="cvv-icon">💳</div>
          </div>
        </div>
      </div>

      <!-- Name on Card -->
      <div class="form-field">
        <label class="form-label">Name on card</label>
        <input type="text" placeholder="Enter cardholder name" class="form-input" />
      </div>

      <!-- Billing Address -->
      <div class="form-field">
        <label class="form-label">Billing address</label>
        <div style="margin-bottom: 15px;">
          <select class="form-select">
            <option>United States</option>
            <option>Canada</option>
            <option>United Kingdom</option>
            <option>Australia</option>
          </select>
        </div>
        <div style="margin-bottom: 10px;">
          <input type="text" placeholder="Address" class="form-input" />
        </div>
        <a href="#" class="manual-link">Enter address manually</a>
      </div>

      <!-- Save Info Checkbox -->
      <div class="checkbox-container">
        <label class="checkbox-label">
          <input type="checkbox" class="checkbox-input" />
          <div>
            <div class="checkbox-text">Save my info for secure 1-click checkout</div>
            <div class="checkbox-subtext">Pay faster on StakNine and thousands of sites.</div>
          </div>
        </label>
      </div>

      <!-- Pay Button -->
      <button class="pay-button" id="submit-button">Pay</button>
    </div>
  </div>

  <justifi-modular-checkout
    auth-token="authToken"
    account-id="acc_123"
    checkout-id="cho_123"
    save-payment-method="true"
  >
    <justifi-card-form />
    <justifi-postal-code-form />
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
