const light = `
body {
  background-color: #efefef;
}

justifi-checkout,
justifi-payment-form,
justifi-payment-provisioning,
justifi-business-form,
justifi-season-interruption-insurance,
justifi-payment-details,
justifi-payout-details,
justifi-payments-list,
justifi-payouts-list {
  display: block;
  margin: 5% auto;
  background-color: #fff;
  border-radius: 0px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
}

justifi-checkout,
justifi-payment-form {
  max-width: 400px;
  padding: 40px;
}

justifi-season-interruption-insurance {
  display: block;
  padding: 20px 20px 10px 20px;
  border: 1px solid #ddd;
}

justifi-payment-provisioning {
  max-width: 900px;
  padding: 40px;
}

::part(header-1) {
  color: #000;
}

::part(header-2) {
  color: #333;
  border-bottom: 1px solid #333;
  padding-bottom: 0.5rem;
}

::part(header-3) {
  color: #333;
}

::part(radio-input) {
  background-color: #fff;
  border-color: #333;
}

::part(radio-input-checked) {
  background-color: #000;
}

::part(radio-input-checked):focus {
  background-color: #333;
  border-color: #333;
  box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, .25);
}

::part(radio-input-label) {
  color: #333;
}

::part(input-group-input) {
  margin-left: -1px; 
}

::part(radio-list-item) {
  cursor: pointer;
  color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
}

::part(radio-list-item):hover {
  background-color: rgba(0, 0, 0, .025);
}

::part(input) {
  background-color: transparent;
  border-color: #555;
  border-width: 1px;
  border-bottom-width: 1px;
  border-left-width: 1px;
  border-right-width: 1px;
  border-top-width: 1px;
  border-radius: 0;
  border-style: solid;
  box-shadow: none;
  color: #000;
  font-size: 1rem;
  font-weight: normal;
  line-height: 1.5;
  padding: 0.375rem 0.75rem;
}

::part(input):focus {
  background-color: transparent;
  border-color: #333;
  box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, .25);
}
  
::part(input-focused) {
  background-color: transparent;
  border-color: #333;
  box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, .25);
}

::part(input-invalid) {
  border-color: rgb(138, 42, 35);
  box-shadow: 0 0 0 0.25rem rgba(244, 67, 54, 0.25);
}

::part(radio-input-invalid) {
  border-color: #dc3545;
}

::part(input):disabled {
  background-color: #e9ecef;
  color: #333;
}

::part(form-check-input) {
  border-color: #333;
}

::part(form-check-input):focus {
  box-shadow: 0 0 0 0.25rem rgba(0, 0, 0, .25);
}

::part(form-check-input-checked) {
  background-color: #333;
}

::part(button) {
  padding: 0.375rem 0.75rem;
  font-size: 16px;
  box-shadow: none;
  border-radius: 0px;
  line-height: 1.5;
  text-transform: none;
}

::part(button-spinner) {
  border-top-color: rgba(0, 0, 0, 0.5);
  border-bottom-color: rgba(0, 0, 0, 0.5);
  border-left-color: rgba(0, 0, 0, 0.5);
}

::part(button-primary) {
  color: #333;
  background-color: transparent;
  border-color: #333;
}

::part(button-primary):hover {
  background-color: rgba(0, 0, 0, .05);
  border-color: #333;
  color: #333;
}

::part(button-secondary) {
  color: #333;
  background-color: transparent;
  border-color: #333;
}

::part(button-secondary):hover {
  background-color: rgba(0, 0, 0, .05);
  border-color: #333;
  color: #333;
}

justifi-payment-provisioning::part(header-2),
justifi-business-details::part(header-2) {
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
}

justifi-business-details,
justifi-business-form,
justifi-payment-details {
  display: inline-block;
  background-color: #fff;
  padding: 40px;
}

::part(detail-section) {
  margin-top: 25px;
}

::part(detail-head) {
  background-color: #f9fafb;
  padding: 16px;
  border-bottom: none;
}

::part(detail-head-amount) {
  font-size: 2rem;
  font-weight: bold;
  color: #111827; 
  font-family: 'Roboto', sans-serif;
}

::part(detail-head-currency) {
  font-size: 1.5rem;
  color: #6b7280; 
  font-family: 'Roboto', sans-serif;
}

::part(detail-head-badge) {
  color: #065f46;
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
  color: #4b5563; 
}

::part(detail-head-info-item-data) {
  color: #374151;
}

::part(detail-section) {
  background-color: #ffffff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

::part(detail-section-item) {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

::part(detail-section-item-title) {
  font-weight: bold;
  color: #374151;
}

::part(detail-section-item-data) {
  color: #6b7280; 
}

::part(detail-metadata) {
  background-color: #f3f4f6; 
  padding: 16px;
  border-radius: 8px;
  color: #1f2937; 
}

justifi-payment-details::part(header-2) {
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: bold;
}

justifi-payment-details,
justifi-payout-details,
justifi-payments-list,
justifi-payouts-list {
  background-color: #f9fafb; 
  color: #374151; 
  padding: 16px;
}

justifi-payments-list::part(label),
justifi-payouts-list::part(label) {
  color: #212529;
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-size: .8rem;
  margin: 0 0 .5rem 0;
}

justifi-payments-list::part(input),
justifi-payouts-list::part(input) {
  background-color: #F4F4F6;
  border-color: rgba(0, 0, 0, 0.42);
  border-bottom-width: 1px;
  border-left-width: 0;
  border-right-width: 0;
  border-top-width: 0;
  border-radius: 4px 4px 0 0;
  border-style: solid;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  color: #212529;
  font-size: .8rem;
  font-weight: 400;
  line-height: 2;
  margin: 0;
  padding: .5rem .875rem;
}

justifi-payments-list::part(input):focus,
justifi-payouts-list::part(input):focus {
  color: #212529;
  border-color: #fccc32;
  box-shadow: none;
}

justifi-payments-list::part(input-invalid),
justifi-payouts-list::part(input-invalid) {
  border-color: #C12727;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

::part(table-head-cell) {
  background-color: #fff;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

::part(table-row):hover {
  cursor: pointer;
}

::part(table-cell) {
  background-color: transparent;
  font-weight: normal;
  font-size: 0.8rem;
}

::part(loading-state-spinner) {
  color: #ccc;
}

::part(page-link) {
  background-color: transparent;
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

export default light;
