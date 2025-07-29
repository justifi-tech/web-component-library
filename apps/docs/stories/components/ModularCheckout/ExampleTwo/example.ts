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
      background-color: #ffffff;
      color: #000000;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 40px;
      border-bottom: 1px solid #e0e0e0;
    }

    .logo {
      font-size: 24px;
      font-weight: bold;
    }

    .logo span:first-child {
      color: #2d5a27;
    }

    .logo span:last-child {
      color: #4a7c59;
    }

    .nav {
      display: flex;
      align-items: center;
      gap: 30px;
    }

    .nav a {
      text-decoration: none;
      color: #000000;
      font-weight: 500;
      text-transform: uppercase;
      font-size: 14px;
    }

    .cart-icon {
      position: relative;
      cursor: pointer;
    }

    .cart-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background-color: #000000;
      color: #ffffff;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
    }

    .main-container {
      display: flex;
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
      gap: 40px;
    }

    .checkout-section {
      flex: 2;
    }

    .cart-section {
      flex: 1;
    }

    .checkout-title {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 30px;
      color: #000000;
    }

    .section {
      margin-bottom: 30px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #000000;
    }

    .edit-link {
      color: #2d5a27;
      text-decoration: none;
      font-size: 14px;
      cursor: pointer;
    }

    .shipping-info {
      line-height: 1.6;
      color: #000000;
    }

    .delivery-date {
      font-weight: bold;
    }

    .paypal-button {
      width: 100%;
      background-color: #ffc439;
      border: none;
      padding: 15px;
      border-radius: 4px;
      color: #ffffff;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .divider {
      text-align: center;
      margin: 20px 0;
      position: relative;
    }

    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background-color: #e0e0e0;
    }

    .divider span {
      background-color: #ffffff;
      padding: 0 15px;
      color: #666666;
      font-size: 14px;
    }

    .form-row {
      display: flex;
      gap: 15px;
      margin-bottom: 15px;
    }

    .form-field {
      flex: 1;
    }

    .form-field.full-width {
      width: 100%;
    }

    .card-icons {
      display: flex;
      gap: 5px;
      margin-top: 5px;
    }

    .card-icon {
      width: 30px;
      height: 20px;
      background-color: #f0f0f0;
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: bold;
    }

    .place-order-button {
      width: 100%;
      background-color: #2d5a27;
      border: none;
      padding: 15px;
      border-radius: 4px;
      color: #ffffff;
      font-size: 16px;
      font-weight: bold;
      text-transform: uppercase;
      cursor: pointer;
      margin-top: 20px;
    }

    .terms-text {
      font-size: 12px;
      color: #666666;
      margin-top: 10px;
      text-align: center;
    }

    .terms-link {
      color: #2d5a27;
      text-decoration: none;
    }

    .cart-box {
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 20px;
      background-color: #ffffff;
    }

    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .cart-title {
      font-size: 18px;
      font-weight: bold;
      color: #000000;
    }

    .order-summary {
      margin-bottom: 20px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .summary-row.total {
      font-weight: bold;
      font-size: 16px;
      border-top: 1px solid #e0e0e0;
      padding-top: 10px;
      margin-top: 10px;
    }

    .item-list {
      border-top: 1px solid #e0e0e0;
      padding-top: 15px;
    }

    .item-header {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 10px;
      margin-bottom: 15px;
      font-size: 12px;
      color: #666666;
      text-transform: uppercase;
      font-weight: 500;
    }

    .item-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 10px;
      align-items: start;
    }

    .item-name {
      font-weight: 500;
      color: #000000;
    }

    .item-description {
      font-size: 12px;
      color: #666666;
      margin-top: 2px;
    }

    .item-qty {
      text-align: center;
      color: #000000;
    }

    .item-price {
      text-align: right;
      color: #000000;
    }

    ::part(font-family) {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    ::part(color) {
      color: #000000;
    }

    ::part(background-color) {
      background-color: #ffffff;
    }

    ::part(input) {
      border-color: #e0e0e0;
      border-width: 1px;
      border-radius: 4px;
      border-style: solid;
      box-shadow: none;
      font-size: 14px;
      font-weight: normal;
      line-height: 1.5;
      padding: 12px 15px;
      background-color: #ffffff;
    }

    ::part(input-focused) {
      border-color: #2d5a27;
      box-shadow: 0 0 0 2px rgba(45, 90, 39, 0.1);
    }

    ::part(input-invalid) {
      border-color: #dc3545;
      box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.1);
    }

    ::part(label) {
      font-size: 14px;
      font-weight: 500;
      color: #000000;
      margin-bottom: 5px;
    }

    ::part(button) {
      padding: 12px 15px;
      font-size: 14px;
      box-shadow: none;
      border-radius: 4px;
      line-height: 1.5;
      text-transform: none;
    }

    ::part(button-primary) {
      color: #ffffff;
      background-color: #2d5a27;
      border-color: #2d5a27;
    }

    ::part(button-primary):hover {
      background-color: #1e3d1a;
      border-color: #1e3d1a;
      color: #ffffff;
    }
  </style>`
)}

<body>
  <!-- Header -->
  <div class="header">
    <div class="logo">
      <span>nordic</span><span>BREW</span>
    </div>
    <div class="nav">
      <a href="#">SHOP</a>
      <a href="#">LEARN</a>
      <div class="cart-icon">
        🛒
        <div class="cart-badge">1</div>
      </div>
    </div>
  </div>

  <!-- Main Container -->
  <div class="main-container">
    <!-- Checkout Section -->
    <div class="checkout-section">
      <h1 class="checkout-title">Checkout</h1>
      
      <!-- Shipping Section -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Shipping</h2>
          <a href="#" class="edit-link">Edit</a>
        </div>
        <div class="shipping-info">
          <div>Rowena Benivedez</div>
          <div>29181 West River Drive, Sacramento, CA 95833</div>
          <div>Standard Shipping: Free</div>
          <div class="delivery-date">Arrive Thursday, October 31st</div>
        </div>
      </div>

      <!-- Payment Method Section -->
      <div class="section">
        <h2 class="section-title">Payment Method</h2>
        
        <button class="paypal-button">
          <span>PayPal</span>
        </button>
        
        <div class="divider">
          <span>or</span>
        </div>

        <justifi-modular-checkout
          auth-token="authToken"
          account-id="acc_123"
          checkout-id="cho_123"
        >
          <justifi-card-form />
          <justifi-postal-code-form />
        </justifi-modular-checkout>

        <button class="place-order-button" id="submit-button">
          PLACE ORDER
        </button>
        
        <div class="terms-text">
          By clicking Place Order you agree to the <a href="#" class="terms-link">Terms & Conditions.</a>
        </div>
      </div>
    </div>

    <!-- Shopping Cart Section -->
    <div class="cart-section">
      <div class="cart-box">
        <div class="cart-header">
          <h2 class="cart-title">Shopping Cart</h2>
          <a href="#" class="edit-link">Edit</a>
        </div>
        
        <div class="order-summary">
          <div class="summary-row">
            <span>Subtotal</span>
            <span>$38.00</span>
          </div>
          <div class="summary-row">
            <span>Shipping Fee</span>
            <span>Free</span>
          </div>
          <div class="summary-row">
            <span>Tax</span>
            <span>$4.00</span>
          </div>
          <div class="summary-row total">
            <span>Order Total</span>
            <span>$42.00</span>
          </div>
        </div>
        
        <div class="item-list">
          <div class="item-header">
            <span>ITEM</span>
            <span style="text-align: center;">QTY</span>
            <span style="text-align: right;">PRICE</span>
          </div>
          <div class="item-row">
            <div>
              <div class="item-name">Drip Coffee Funnel</div>
              <div class="item-description">8 cups / 64 ounces</div>
            </div>
            <div class="item-qty">1</div>
            <div class="item-price">$38.00</div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
