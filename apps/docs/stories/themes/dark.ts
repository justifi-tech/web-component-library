const dark = `
body {
  background-color: #161616;
}

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

::part(radio-list-item) {
  cursor: pointer;
  color: #fff;
  background-color: #191919;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
}

::part(radio-list-item):hover {
  background-color: rgba(255, 120, 90, 0.25);
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

::part(detail-head) {
  background-color: #191919;
  padding: 16px;
}

::part(detail-head-amount) {
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
}

::part(detail-head-currency) {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.7);
}

::part(detail-head-badge) {
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

::part(detail-section) {
  background-color: #191919; 
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  margin-top: 25px;
}

::part(detail-section-item) {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
}

::part(detail-section-item-title) {
  font-weight: bold;
  color: #fff; 
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
  color: #fff;
  padding: 16px;
}

::part(table-head-cell) {
  color: #fff;
  background-color: #333;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

::part(table-row):hover {
  cursor: pointer;
}

::part(table-cell) {
  color: #fff;
  background-color: transparent;
  font-weight: normal;
  font-size: 0.8rem;
}

::part(loading-state-spinner) {
  color: #cccccc; 
}

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

::part(page-link) {
  background-color: transparent;
  color: #fff;
  border: none;
}

::part(page-link-disabled) {
  opacity: 0.5;
  cursor: auto;
}

::part(page-link):hover {
  cursor: pointer;
  text-decoration: underline;
}
`;

export default dark;
