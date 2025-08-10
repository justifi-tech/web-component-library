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
        <!-- Payment Method Selection -->
        <div class="payment-method-selection">
          <div class="payment-method-card selected" data-payment-method="card">
            <div class="payment-method-text">Card</div>
          </div>
          <div class="payment-method-card" data-payment-method="bank">
            <div class="payment-method-text">Bank account</div>
          </div>
          <div class="payment-method-card dark" data-payment-method="apple">
            <div class="payment-method-text">Apple Pay</div>
          </div>
        </div>

        <!-- Card Form -->
        <div class="card-form-container" data-form-type="card">
          <justifi-card-form></justifi-card-form>
        </div>

        <!-- Bank Account Form -->
        <div class="bank-account-form-container" data-form-type="bank" style="display: none;">
          <justifi-bank-account-form></justifi-bank-account-form>
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
            <justifi-card-billing-form-simple></justifi-card-billing-form-simple>
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
