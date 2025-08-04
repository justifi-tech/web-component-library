export const getSlotContentExample1 = (): string => {
  return `
    <div class="donation-container">
      <!-- Donation Total Header -->
      <div class="donation-header">
        <span>Donation Total</span>
        <span>$10.00</span>
      </div>

      <!-- Main Payment Form Container -->
      <div class="payment-form-container">
        <!-- Header with Radio Button -->
        <div class="payment-header">
          <div class="radio-button">
            <div class="radio-button-inner"></div>
          </div>
          <span>Donate with Stripe Payment Element</span>
        </div>

        <!-- Payment Method Selection -->
        <div class="payment-method-selection">
          <div class="payment-method-card selected">
            <div class="payment-method-icon">💳</div>
            <div class="payment-method-text">Card</div>
          </div>
          <div class="payment-method-card">
            <div class="payment-method-icon cash-app">$</div>
            <div class="payment-method-text">Cash App Pay</div>
          </div>
          <div class="payment-method-card">
            <div class="payment-method-icon bank">🏦</div>
            <div class="payment-method-text">US bank account</div>
          </div>
        </div>

        <!-- Card Form -->
        <div class="card-form-container">
          <justifi-card-form></justifi-card-form>
        </div>

        <!-- Country and ZIP Fields -->
          <div class="country-zip-container">
          <div class="country-field">
            <label class="form-label">Country</label>
            <select class="form-select">
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
              <option>Australia</option>
              <option>New Zealand</option>
              <option>Other</option>
            </select>
          </div>
          <div class="zip-field">
            <justifi-postal-code-form></justifi-postal-code-form>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <button class="submit-button">
        <span>Donate Now</span>
      </button>
    </div>
  `;
};
