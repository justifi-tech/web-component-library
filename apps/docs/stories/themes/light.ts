const light = `
body {
  background-color: #efefef;
}

/* Card styling */

justifi-checkout,
justifi-payment-form,
justifi-payment-provisioning {
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

::part(header-2) {
  color: #333;
  border-bottom: 1px solid #333;
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
  color: var(--jfi-body-color);
  font-size: 1rem;
  font-weight: normal;
  line-height: 1.5;
  margin: 0;
  padding: 0.375rem 0.75rem;
}

::part(input):focus {
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
  background-color: transparent;
  color: rgba(255, 255, 255, 0.5);
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

::part(button-primary) {
  width: 100%;
  padding: 6px 18px;
  font-size: 16px;
  box-shadow: none;
  border-radius: 0px;
  line-height: 1.75;
  text-transform: none;

  color: #333;
  background-color: transparent;
  border-color: #333;
}

::part(button-primary):hover {
  background-color: rgba(0, 0, 0, .05);
  border-color: #333;
  color: #333;
}

:root {
  /* new vars */
  --jfi-body-color: #333;
  --jfi-header-color: #222;
  --jfi-header-border: 1px solid #222;

  /* general */
  --jfi-load-google-font: 'Open Sans', sans-serif;

  /* layout */
  --jfi-layout-font-family: Arial, sans-serif;
  --jfi-layout-padding: 20px;
  --jfi-layout-form-control-spacing-x: 10px;
  --jfi-layout-form-control-spacing-y: 10px;

  /* form control */
  --jfi-form-control-background-color: transparent;
  --jfi-form-control-border-color: #555;
  --jfi-form-control-border-color-focus: #333;
  --jfi-form-control-border-color-error: rgb(138, 42, 35);
  --jfi-form-control-border-width: 1px;
  --jfi-form-control-border-bottom-width: 1px;
  --jfi-form-control-border-left-width: 1px;
  --jfi-form-control-border-right-width: 1px;
  --jfi-form-control-border-top-width: 1px;
  --jfi-form-control-border-radius: 0;
  --jfi-form-control-border-style: solid;
  --jfi-form-control-box-shadow: none;
  --jfi-form-control-box-shadow-error: 0 0 0 0.25rem rgba(244, 67, 54, 0.25);
  --jfi-form-control-box-shadow-error-focus: 0 0 0 0.25rem rgba(244, 67, 54, 0.4);
  --jfi-form-control-box-shadow-focus: 0 0 0 0.25rem rgba(0, 0, 0, .25);
  --jfi-form-control-color: var(--jfi-body-color);
  --jfi-form-control-color-focus: var(--jfi-body-color);
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
  --jfi-error-message-color: rgb(138, 42, 35);
  --jfi-error-message-margin: 8px 0 0 0;
  --jfi-error-message-font-size: 12px;

  /* Skeleton */
  --jfi-skeleton-wave-animation-bg: rgba(200, 200, 200, 1);
}
`;

export default light;
