const dark = `
body {
  background-color: #161616;
}

justifi-checkout {
  display: block;
  max-width: 400px;
  margin: 5% auto;
  padding: 40px;
  background-color: #191919;
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

  /* Below only used in justifi-payment-form */
  /* form radio group */
  --jfi-radio-input-background-color: transparent;
  --jfi-radio-input-border-color: rgba(255, 255, 255, 0.7);

  --jfi-radio-input-background-color-selected: rgba(255, 120, 90, .5);
  --jfi-radio-input-border-color-selected: rgba(255, 120, 90, 1);

  --jfi-radio-input-box-shadow-focus: 0 0 0 0.25rem rgba(255, 120, 90, 0.25);
  --jfi-radio-input-border-color-focus: rgb(164, 201, 245);

  --jfi-radio-button-padding: 5px;
  --jfi-radio-button-font-size: 16px;

  --jfi-radio-button-group-width: 100%;
  --jfi-radio-button-group-color: var(--jfi-body-color);
  --jfi-radio-button-group-color-hover: #fff;
  --jfi-radio-button-group-divider: 1px solid rgba(255, 255, 255, 0.5);
  --jfi-radio-button-group-background-color: transparent;
  --jfi-radio-button-group-background-color-hover: rgba(255, 120, 90, 0.25);


  /* submit button */
  --jfi-submit-button-width: 100%;
  --jfi-submit-button-padding: 5px 15px;
  --jfi-submit-button-font-size: 16px;
  --jfi-submit-button-box-shadow: none;
  --jfi-submit-button-border-radius: 4px;
  --jfi-submit-button-line-height: 1.75;
  --jfi-submit-button-text-transform: uppercase;

  --jfi-submit-button-color: #191919;
  --jfi-submit-button-background-color: #FFF05A;
  --jfi-submit-button-border-color: #FFF05A;

  --jfi-submit-button-color-hover: #191919;
  --jfi-submit-button-background-color-hover: #FFD25A;
  --jfi-submit-button-border-color-hover: #FFD25A;

  --jfi-submit-button-color-focus: #191919;
  --jfi-submit-button-background-color-focus: #FFD25A;
  --jfi-submit-button-border-color-focus: #FFD25A;

  --jfi-submit-button-color-active: #191919;
  --jfi-submit-button-background-color-active: #FFAA5A;
  --jfi-submit-button-border-color-active: #FFAA5A;

  --jfi-submit-button-color-loading: rgba(255, 255, 255, 1);
  --jfi-submit-button-border-color-loading: rgba(255, 255, 255, 0.25);
  --jfi-submit-button-background-color-loading: rgba(255, 255, 255, 0.25);

   /* Skeleton */
  --jfi-skeleton-wave-bg: rgba(255, 0, 0, 0.2)
;
}
`;

export default dark;
