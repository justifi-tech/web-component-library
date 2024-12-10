const light = `
body {
  background-color: #efefef;
}

/* Card styling */

justifi-checkout,
justifi-payment-form,
justifi-tokenize-payment-method,
justifi-payment-provisioning {
  display: block;
  margin: 5% auto;
  background-color: #fff;
  border-radius: 0px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
}


justifi-checkout,
justifi-payment-form,
justifi-tokenize-payment-method {
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

  /* colors */
  --jfi-primary-color: rgb(164, 201, 245);

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

  /* Below only used in justifi-payment-form */
  /* form radio group */
  --jfi-radio-input-background-color: transparent;
  --jfi-radio-input-border-color: #555;

  --jfi-radio-input-background-color-selected: #333;
  --jfi-radio-input-border-color-selected: #333;

  --jfi-radio-input-box-shadow-focus: 0 0 0 0.25rem rgba(0, 0, 0, .25);
  --jfi-radio-input-border-color-focus: #333;

  --jfi-radio-button-padding: 5px;
  --jfi-radio-button-font-size: 16px;

  --jfi-radio-button-group-width: 100%;
  --jfi-radio-button-group-color: var(--jfi-body-color);
  --jfi-radio-button-group-color-hover: initial;
  --jfi-radio-button-group-divider: 1px solid rgba(0, 0, 0, 0.25);
  --jfi-radio-button-group-background-color: transparent;
  --jfi-radio-button-group-background-color-hover: rgba(0, 0, 0, .025);

  --jfi-radio-button-background-color: transparent;
  --jfi-radio-button-border-color: #333;

  --jfi-radio-button-background-color-selected: #333;
  --jfi-radio-button-border-color-selected: #333;

  --jfi-radio-button-border-color-focus: #333;
  --jfi-radio-button-box-shadow-focus: 0 0 0 0.25rem rgba(0, 0, 0, .25);

  /* submit button */
  --jfi-submit-button-width: 100%;
  --jfi-submit-button-padding: 6px 18px;
  --jfi-submit-button-font-size: 16px;
  --jfi-submit-button-box-shadow: none;
  --jfi-submit-button-border-radius: 0px;
  --jfi-submit-button-line-height: 1.75;
  --jfi-submit-button-text-transform: none;

  --jfi-submit-button-color: #333;
  --jfi-submit-button-background-color: transparent;
  --jfi-submit-button-border-color: #333;

  --jfi-submit-button-color-hover: #222;
  --jfi-submit-button-background-color-hover: rgba(0, 0, 0, .05);
  --jfi-submit-button-border-color-hover: #222;

  --jfi-submit-button-color-focus: rgb(144, 202, 249);
  --jfi-submit-button-background-color-focus: rgba(144, 202, 249, .1);
  --jfi-submit-button-border-color-focus: rgba(144, 202, 249, 1);

  --jfi-submit-button-color-active: rgb(144, 202, 249);
  --jfi-submit-button-background-color-active: rgba(144, 202, 249, .25);
  --jfi-submit-button-border-color-active: rgba(144, 202, 249, 1);

  --jfi-submit-button-color-loading: rgba(0, 0, 0, 0.5);
  --jfi-submit-button-border-color-loading: rgba(0, 0, 0, 0.5);
  --jfi-submit-button-background-color-loading: transparent;

  /* Skeleton */
  --jfi-skeleton-wave-animation-bg: rgba(200, 200, 200, 1);

  /* Tooltip */
  ::part(tooltip) {
    --bs-tooltip-opacity: 1;
    --bs-tooltip-border-radius: 0px;
    border: 1px solid #222;
  }

  ::part(tooltip-inner) {
    --bs-tooltip-bg: var(--bs-gray-200);
    --bs-tooltip-color: var(--bs-dark);
  }
}
`;

export default light;
