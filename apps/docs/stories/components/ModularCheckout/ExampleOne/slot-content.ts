export interface SlotContentOptions {
  variant: 'HTML' | 'JSX';
}

export const getSlotContent = (options: SlotContentOptions): string => {
  const { variant } = options;

  if (variant === 'JSX') {
    return `
      <div className="donation-container">
        {/* Donation Total Header */}
        <div className="donation-header">
          <span>Donation Total</span>
          <span>$10.00</span>
        </div>

        {/* Main Payment Form Container */}
        <div className="payment-form-container">
          {/* Header with Radio Button */}
          <div className="payment-header">
            <div className="radio-button">
              <div className="radio-button-inner"></div>
            </div>
            <span>Donate with Stripe Payment Element</span>
          </div>

          {/* Payment Method Selection */}
          <div className="payment-method-selection">
            <div className="payment-method-card selected">
              <div className="payment-method-icon">💳</div>
              <div className="payment-method-text">Card</div>
            </div>
            <div className="payment-method-card">
              <div className="payment-method-icon cash-app">$</div>
              <div className="payment-method-text">Cash App Pay</div>
            </div>
            <div className="payment-method-card">
              <div className="payment-method-icon bank">🏦</div>
              <div className="payment-method-text">US bank account</div>
            </div>
          </div>

          {/* Card Form */}
          <div className="card-form-container">
            <justifi-card-form />
          </div>

          {/* Country and ZIP Fields */}
          <div className="country-zip-container">
            <div className="country-field">
              <label className="form-label">Country</label>
              <select className="form-select">
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
                <option>Australia</option>
                <option>New Zealand</option>
                <option>Other</option>
              </select>
            </div>
            <div className="zip-field">
              <justifi-postal-code-form />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button className="submit-button">
          <span>Donate Now</span>
        </button>
      </div>
    `;
  } else {
    // HTML variant
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
            <justifi-card-form />
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
              <justifi-postal-code-form />
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <button class="submit-button">
          Donate Now
        </button>
      </div>
    `;
  }
};
