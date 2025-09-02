export const getSlotContentExample3 = (): string => {
  return `
    <div class="checkout-container">
      <!-- Header Bar -->
      <div class="checkout-header">
        <div class="checkout-brand">
          <span class="checkout-back-arrow">←</span>
          <span class="checkout-brand-name">JustiFi Store</span>
        </div>
      </div>

      <!-- Main Container -->
      <div class="checkout-main-container">
        <!-- Left Column - Order Summary -->
        <div class="checkout-order-summary">
          <!-- Pay Header -->
          <div class="checkout-pay-header">
            <h1 class="checkout-pay-title">Pay JustiFi Store</h1>
            <div class="checkout-pay-amount">$39.99</div>
          </div>

          <!-- Product Item -->
          <div class="checkout-product-item">
            <div class="checkout-product-image">📚</div>
            <div class="checkout-product-details">
              <div class="checkout-product-name">Fintech Deployhandbook Test</div>
              <div class="checkout-product-description">How to deploy Fintech app...</div>
            </div>
            <div class="checkout-product-price">$39.99</div>
          </div>

          <!-- Summary Breakdown -->
          <div class="checkout-summary-breakdown">
            <div class="checkout-summary-row">
              <span>Subtotal</span>
              <span>$39.99</span>
            </div>
            <div class="checkout-summary-row tax">
              <div class="checkout-tax-info">
                <span>Tax</span>
                <span class="checkout-tax-icon">ⓘ</span>
              </div>
              <span class="checkout-tax-placeholder">Enter address to calculate</span>
            </div>
            <div class="checkout-summary-row total">
              <span>Total due</span>
              <span>$39.99</span>
            </div>
          </div>

          <!-- Footer -->
          <div class="checkout-footer">
            <div class="checkout-powered-by">
              Powered by <span class="checkout-justifi-text">JustiFi</span>
            </div>
            <div class="checkout-footer-links">
              <a href="#" class="checkout-footer-link">Terms</a>
              <a href="#" class="checkout-footer-link">Privacy</a>
            </div>
          </div>
        </div>

        <!-- Right Column - Payment Form -->
        <div class="checkout-payment-form">
          <h2 class="checkout-form-title">Pay with card</h2>

          <!-- Email Field -->
          <div class="checkout-form-field">
            <label class="checkout-form-label">Email</label>
            <input type="email" placeholder="Enter your email" class="checkout-form-input" />
          </div>

          <!-- Card Information -->
          <div class="checkout-form-field">
            <justifi-card-form></justifi-card-form>
            <justifi-card-billing-form-simple></justifi-card-billing-form-simple>
          </div>

          <!-- Name on Card -->
          <div class="checkout-form-field">
            <label class="checkout-form-label">Name on card</label>
            <input type="text" placeholder="Enter cardholder name" class="checkout-form-input" />
          </div>

          <!-- Billing Address -->
          <div class="checkout-form-field">
            <label class="checkout-form-label">Billing address</label>
            <div style="margin-bottom: 45px;">
              <select class="checkout-form-select">
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
                <option>Australia</option>
              </select>
            </div>
            <div style="margin-bottom: 15px;">
              <input type="text" placeholder="Address" class="checkout-form-input" />
            </div>
            <a href="#" class="checkout-manual-link">Enter address manually</a>
          </div>

          <!-- Save Info Checkbox -->
          <div class="checkout-checkbox-container">
            <justifi-save-new-payment-method label="Save this for next time"></justifi-save-new-payment-method>
          </div>

          <!-- Pay Button -->
          <button class="checkout-pay-button" id="submit-button">
            Pay
          </button>
        </div>
      </div>
    </div>
  `;
};
