const dark = `
body {
  background-color: #161616;
}

/* Card styling */

justifi-checkout,
justifi-business-details,
justifi-payment-form,
justifi-payment-provisioning,
justifi-payment-details,
justifi-payouts-details,
justifi-payments-list,
justifi-payouts-list {
  display: block;
  margin: 5% auto;
  background-color: #191919;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

justifi-checkout,
justifi-payment-form {
  max-width: 400px;
  padding: 40px;
}

justifi-season-interruption-insurance {
  display: block;
  padding: 20px 20px 10px 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

justifi-payment-provisioning {
  max-width: 900px;
  padding: 40px;
}

::part(input-group-text) {
  background-color: rgba(255,255,255,0.2);
  color: #fff;
}

::part(header-1) {
  color: #fff;
}

::part(header-2) {
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
  padding-bottom: 0.5rem;
}

::part(header-3) {
  color: #fff;
}

::part(input) {
  color: #fff;
  background-color: #191919;
  appearance: none;
  -webkit-appearance: none;
}

::part(input):focus {
  color: #fff;
  background-color: #191919;
  appearance: none;
  -webkit-appearance: none;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.4);
}

::part(label) {
  color: #fff;
}

::part(radio-input) {
  background-color: transparent;
  border-color: #fff;
}

::part(radio-input-checked) {
  background-color: rgba(255, 120, 90, .5);
  border-color: #ff785a;
}

::part(radio-input-invalid) {
  border-color: #dc3545;
}

::part(radio-input-checked):focus {
  border-color: #ff785a;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.4);
}

::part(radio-input-label) {
  color: #fff;
}

::part(payment-method-header):hover {
  background-color: rgba(255, 120, 90, 0.25);
  cursor: pointer;
}

::part(button) {
  padding: 8px 16px;
}

::part(button-primary) {
  background-color: #FFF05A;
  border-color: #FFF054;
  color: #000;
  border-radius: 4px;
}

::part(button-primary):hover {
  background-color: #FFD25A;
  border-color: #FFD25A;
  color: #000;
}

::part(button-secondary) {
  background-color: #FFF05A;
  border-color: #FFF054;
  color: #000;
  border-radius: 4px;
}

::part(button-secondary):hover {
  background-color: #FFD25A;
  border-color: #FFD25A;
  color: #000;
}

::part(button-link) {
  color: #FFF;
  text-decoration: none;
  border: none;
}

::part(button-link):hover {
  text-decoration: underline;
  cursor: pointer;
}

::part(form-check-input) {
  background-color: transparent;
  border-color: #fff;
}

::part(form-check-input-checked) {
  background-color: rgba(255, 120, 90, .5);
  border-color: #ff785a;
}

justifi-payment-provisioning::part(header-2) {
  padding-bottom: 15px;
  border-color: rgba(255, 255, 255, 0.25);
}

justifi-business-details,
justifi-business-form,
justifi-payment-provisioning,
justifi-payment-details,
justifi-payout-details,
justifi-payments-list,
justifi-payouts-list {
  display: inline-block;
  padding: 40px;
}

::part(detail-header-container) {
  background-color: #191919;
  padding: 16px;
}

::part(detail-header-amount) {
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
}

::part(detail-header-currency) {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.7);
}

::part(detail-header-badge) {
  color: #fff;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.875rem;
}

::part(detail-head-info-item) {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

::part(detail-head-info-item-title) {
  font-weight: bold;
}

::part(detail-head-info-item-data) {
  color: rgba(255, 255, 255, 0.7);
}

::part(detail-section-container) {
  background-color: #191919; 
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

::part(detail-section-item) {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
}

::part(detail-section-item-title) {
  font-weight: bold;
  color: var(--jfi-body-color); 
}

::part(detail-section-item-data) {
  color: rgba(255, 255, 255, 0.7);
}

::part(detail-metadata) {
  background-color: #161616; 
  padding: 16px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  color: rgba(255, 255, 255, 0.9); 
}

justifi-payment-details::part(header-2) {
  color: #fff;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
}

justifi-payment-details {
  background-color: #191919; 
  color: var(--jfi-body-color);
  font-family: var(--jfi-layout-font-family);
  padding: 16px;
}

::part(table-head) {}
  
::part(table-head-row) {}

::part(table-head-cell) {
  color: #fff;
  background-color: #333;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

::part(table-body) {}

::part(table-row) {}

::part(table-row):hover {
  cursor: pointer;
}

::part(table-row-even) {}

::part(table-row-odd) {}

::part(table-cell) {
  color: #fff;
  background-color: transparent;
  font-weight: normal;
  font-size: 0.8rem;
}

::part(loading-state-cell) {}

::part(loading-state-spinner) {
  color: #cccccc; 
}

::part(error-state) {}

::part(empty-state) {}

::part(pagination-bar) {
  color: #fff;
  background-color: transparent;
  border-bottom: none;
}

::part(pagination-buttons-container) {
  background-color: red;
  display: flex;
  gap: 10px;
}

/* For pagination buttons */


::part(page-button-text) {}

::part(loading-state-cell) {
  background-color: #191919;
}

::part(icon) {
  fill: #fff;
  stroke; #fff;
}

::part(card) {
  background-color: #191919;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 4px;
}

::part(card-title) {
  color: #fff;
}

::part(card-subtitle) {
  color: #fff;
}

::part(card-body) {
  color: #fff;
}

:root {
  /* new vars */
  --jfi-body-color: rgb(182, 190, 201);
  --jfi-header-color: #fff;
  --jfi-header-border: 1px solid #fff;

  /* general */
  --jfi-load-google-font: 'Open Sans', sans-serif;

  /* layout */
  --jfi-layout-font-family: Arial, sans-serif;
  --jfi-layout-padding: 20px;
  --jfi-layout-form-control-spacing-x: 10px;
  --jfi-layout-form-control-spacing-y: 10px;

  /* form control */
  --jfi-form-control-background-color: transparent;
  --jfi-form-control-border-color: rgba(255, 255, 255, 0.7);
  --jfi-form-control-border-color-focus: rgb(164, 201, 245);
  --jfi-form-control-border-color-error: #FF785A;
  --jfi-form-control-border-width: 1px;
  --jfi-form-control-border-bottom-width: 1px;
  --jfi-form-control-border-left-width: 1px;
  --jfi-form-control-border-right-width: 1px;
  --jfi-form-control-border-top-width: 1px;
  --jfi-form-control-border-radius: 4px;
  --jfi-form-control-border-style: solid;
  --jfi-form-control-box-shadow: none;
  --jfi-form-control-box-shadow-error: 0 0 0 0.25rem rgba(255, 120, 90, 0.25);
  --jfi-form-control-box-shadow-error-focus: 0 0 0 0.25rem rgba(255, 120, 90, 0.5);
  --jfi-form-control-box-shadow-focus: 0 0 0 0.25rem rgba(13, 110, 253, 0.4);
  --jfi-form-control-color: rgba(255, 255, 255, 1);
  --jfi-form-control-color-focus: rgba(255, 255, 255, 1);
  --jfi-form-control-font-size: 1rem;
  --jfi-form-control-font-weight: normal;
  --jfi-form-control-line-height: 1.5;
  --jfi-form-control-margin: 0;
  --jfi-form-control-padding: 0.375rem 0.75rem;
  --jfi-form-control-disabled-background-color: transparent;
  --jfi-form-control-disabled-color: rgba(255, 255, 255, 0.5);

  /* form label */
  --jfi-form-label-color: var(--jfi-body-color);
  --jfi-form-label-font-family: Arial, sans-serif;
  --jfi-form-label-font-size: 16px;
  --jfi-form-label-font-weight: normal;
  --jfi-form-label-margin: 0 0 0.5rem 0;

  /* validation messages */
  --jfi-error-message-color: #FF785A;
  --jfi-error-message-margin: 5px;
  --jfi-error-message-font-size: 12px;

  /* Skeleton */
  --jfi-skeleton-wave-animation-bg: rgba(255, 255, 255, 0.1);
}
`;

export default dark;
