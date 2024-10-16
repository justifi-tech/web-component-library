const dark = `
body {
  background-color: #161616;
}

/* Card styling */

justifi-checkout,
justifi-payment-form,
justifi-payment-provisioning {
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

justifi-checkout::part(header) {
  color: #fff;
  border-bottom: 1px solid #fff;
}

justifi-checkout::part(sub-header) {
  color: #fff;
}

justifi-season-interruption-insurance::part(radio-input),
justifi-checkout::part(radio-input) {
  background-color: transparent;
  border-color: #fff;
}

justifi-season-interruption-insurance::part(radio-input-checked),
justifi-checkout::part(radio-input-checked) {
  background-color: rgba(255, 120, 90, .5);
  border-color: #ff785a;
}

justifi-season-interruption-insurance::part(radio-input-invalid) {
  border-color: #dc3545;
}

justifi-season-interruption-insurance::part(radio-input-checked):focus,
justifi-checkout::part(radio-input-checked):focus {
  border-color: #ff785a;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.4);
}

justifi-checkout::part(radio-input-label) {
  color: #fff;
}

justifi-checkout::part(payment-method-header):hover {
  background-color: rgba(255, 120, 90, 0.25);
  cursor: pointer;
}

justifi-checkout::part(button-primary) {
  background-color: #FFF05A;
  border-color: #FFF054;
  color: #000;
  border-radius: 4px;
}

justifi-checkout::part(button-primary):hover {
  background-color: #FFD25A;
  border-color: #FFD25A;
  color: #000;
}

justifi-checkout::part(form-check-input) {
  background-color: transparent;
  border-color: #fff;
}

justifi-checkout::part(form-check-input-checked) {
  background-color: rgba(255, 120, 90, .5);
  border-color: #ff785a;
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
