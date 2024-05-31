import { Source } from '@storybook/addon-docs';
import dedent from 'ts-dedent';

export const CSSVars = () => (
  <Source
    language="css"
    dark
    code={dedent`
  /* general */
  --jfi-load-google-font

  /* layout */
  --jfi-layout-font-family
  --jfi-layout-padding
  --jfi-layout-form-control-spacing-x
  --jfi-layout-form-control-spacing-y

  /* colors */
  --jfi-primary-color

  /* form control */
  --jfi-form-control-background-color
  --jfi-form-control-border-color
  --jfi-form-control-border-color-focus
  --jfi-form-control-border-color-error
  --jfi-form-control-border-width
  --jfi-form-control-border-bottom-width
  --jfi-form-control-border-left-width
  --jfi-form-control-border-right-width
  --jfi-form-control-border-top-width
  --jfi-form-control-border-radius
  --jfi-form-control-border-style
  --jfi-form-control-box-shadow
  --jfi-form-control-box-shadow-error
  --jfi-form-control-box-shadow-error-focus
  --jfi-form-control-box-shadow-focus
  --jfi-form-control-color
  --jfi-form-control-color-focus
  --jfi-form-control-font-size
  --jfi-form-control-font-weight
  --jfi-form-control-line-height
  --jfi-form-control-margin
  --jfi-form-control-padding
  --jfi-form-control-disabled-background-color
  --jfi-form-control-disabled-color

  /* form label */
  --jfi-form-label-color
  --jfi-form-label-font-family
  --jfi-form-label-font-size
  --jfi-form-label-font-weight
  --jfi-form-label-margin

  /* validation messages */
  --jfi-error-message-color
  --jfi-error-message-margin
  --jfi-error-message-font-size

  /* Below only used in justifi-payment-form */
  /* form radio group */
  --jfi-radio-button-color
  --jfi-radio-button-background-color
  --jfi-radio-button-color-selected
  --jfi-radio-button-background-color-selected
  --jfi-radio-button-border-color
  --jfi-radio-button-border-color-selected
  --jfi-radio-button-padding
  --jfi-radio-button-font-size
  --jfi-radio-button-color-hover
  --jfi-radio-button-color-selected-hover
  --jfi-radio-button-background-color-hover
  --jfi-radio-button-background-color-selected-hover
  --jfi-radio-button-border-color-selected-hover
  --jfi-radio-button-border-color-hover
  --jfi-radio-button-group-width

  /* Below only used in justifi-checkout */
  /* form radio input */
  --jfi-radio-input-box-shadow-focus
  --jfi-radio-input-background-color-selected
  --jfi-radio-input-border-color
  --jfi-radio-input-border-color-selected

  /* submit button */
  --jfi-submit-button-color
  --jfi-submit-button-background-color
  --jfi-submit-button-border-color
  --jfi-submit-button-padding
  --jfi-submit-button-font-size
  --jfi-submit-button-border-radius
  --jfi-submit-button-color-hover
  --jfi-submit-button-background-color-hover
  --jfi-submit-button-border-color-hover
  --jfi-submit-button-color-focus
  --jfi-submit-button-background-color-focus
  --jfi-submit-button-border-color-focus
  --jfi-submit-button-color-active
  --jfi-submit-button-background-color-active
  --jfi-submit-button-border-color-active
  --jfi-submit-button-width
  --jfi-submit-button-box-shadow
  --jfi-submit-button-color-loading
  --jfi-submit-button-background-color-loading
  --jfi-submit-button-border-color-loading
  `}
  />
);
