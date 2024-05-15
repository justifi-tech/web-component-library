const dark = `
body {
  background-color: rgb(20, 22, 25);
}

justifi-checkout {
  display: block;
  max-width: 400px;
  margin: 5% auto;
  padding: 40px;
  background-color: rgb(28, 31, 35);
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
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

  /* colors */
  --jfi-primary-color: rgb(164, 201, 245);

  /* form control */
  --jfi-form-control-background-color: transparent;
  --jfi-form-control-border-color: rgba(255, 255, 255, 0.7);
  --jfi-form-control-border-color-focus: rgb(164, 201, 245);
  --jfi-form-control-border-color-error: rgb(244, 67, 54);
  --jfi-form-control-border-width: 1px;
  --jfi-form-control-border-bottom-width: 1px;
  --jfi-form-control-border-left-width: 1px;
  --jfi-form-control-border-right-width: 1px;
  --jfi-form-control-border-top-width: 1px;
  --jfi-form-control-border-radius: 0.375rem;
  --jfi-form-control-border-style: solid;
  --jfi-form-control-box-shadow: none;
  --jfi-form-control-box-shadow-error: 0 0 0 0.25rem rgba(244, 67, 54, 0.25);
  --jfi-form-control-box-shadow-error-focus: 0 0 0 0.25rem rgba(244, 67, 54, 0.4);
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
  --jfi-error-message-color: rgb(244, 67, 54);
  --jfi-error-message-margin: 5px;
  --jfi-error-message-font-size: 12px;

  /* Below only used in justifi-payment-form */
  /* form radio group */
  --jfi-radio-button-background-color: transparent;
  --jfi-radio-button-border-color: rgba(255, 255, 255, 0.7);

  --jfi-radio-button-background-color-selected: rgba(164, 201, 245, .4);
  --jfi-radio-button-border-color-selected: rgb(164, 201, 245);

  --jfi-radio-button-box-shadow-focus: 0 0 0 0.25rem rgba(164, 201, 245, .5);
  --jfi-radio-button-border-color-focus: rgb(164, 201, 245);

  --jfi-radio-button-padding: 5px;
  --jfi-radio-button-font-size: 16px;

  --jfi-radio-button-group-width: 100%;
  --jfi-radio-button-group-color: var(--jfi-body-color);
  --jfi-radio-button-group-color-hover: #fff;
  --jfi-radio-button-group-divider: 1px solid rgba(255, 255, 255, 0.5);
  --jfi-radio-button-group-background-color: transparent;
  --jfi-radio-button-group-background-color-hover: rgba(144, 202, 249, .1);


  /* submit button */
  --jfi-submit-button-width: 100%;
  --jfi-submit-button-padding: 5px 15px;
  --jfi-submit-button-font-size: 14px;
  --jfi-submit-button-box-shadow: none;
  --jfi-submit-button-border-radius: 4px;
  --jfi-submit-button-line-height: 1.75;
  --jfi-submit-button-text-transform: uppercase;

  --jfi-submit-button-color: rgb(144, 202, 249);
  --jfi-submit-button-background-color: transparent;
  --jfi-submit-button-border-color: rgba(144, 202, 249, 0.5);

  --jfi-submit-button-color-hover: rgb(144, 202, 249);
  --jfi-submit-button-background-color-hover: rgba(144, 202, 249, .1);
  --jfi-submit-button-border-color-hover: rgba(144, 202, 249, 1);

  --jfi-submit-button-color-focus: rgb(144, 202, 249);
  --jfi-submit-button-background-color-focus: rgba(144, 202, 249, .1);
  --jfi-submit-button-border-color-focus: rgba(144, 202, 249, 1);

  --jfi-submit-button-color-active: rgb(144, 202, 249);
  --jfi-submit-button-background-color-active: rgba(144, 202, 249, .25);
  --jfi-submit-button-border-color-active: rgba(144, 202, 249, 1);

  --jfi-submit-button-color-loading: rgba(255, 255, 255, 0.5);
  --jfi-submit-button-border-color-loading: rgba(255, 255, 255, 0.5);
  --jfi-submit-button-background-color-loading: transparent;
}
`;

export default dark;