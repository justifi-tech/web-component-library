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

  `}
  />
);

export const CSSVarsExample = `
  --jfi-primary-color: #212529;
  --jfi-load-google-font: 'Roboto Mono:wght@200;400;700;900';
  --jfi-layout-font-family: Roboto Mono, Calibri, sans-serif;
  --jfi-layout-padding: 4px;
  --jfi-layout-form-control-spacing-x: .5rem;
  --jfi-layout-form-control-spacing-y: 1rem;
  --jfi-form-label-font-weight: 700;
  --jfi-form-label-font-family: Calibri, sans-serif;
  --jfi-form-label-margin: 0 0 .5rem 0;
  --jfi-form-control-background-color: #F4F4F6;
  --jfi-form-control-background-color-hover: #EEEEF5;
  --jfi-form-control-border-color: rgba(0, 0, 0, 0.42);
  --jfi-form-control-border-color-hover: rgba(0, 0, 0, 0.62);
  --jfi-form-control-border-color-focus: #fccc32;
  --jfi-form-control-border-color-error: #C12727;
  --jfi-form-control-border-top-width: 0;
  --jfi-form-control-border-left-width: 0;
  --jfi-form-control-border-bottom-width: 1px;
  --jfi-form-control-border-right-width: 0;
  --jfi-form-control-border-radius: 4px 4px 0 0;
  --jfi-form-control-border-style: solid;
  --jfi-form-control-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  --jfi-form-control-box-shadow-focus: none;
  --jfi-form-control-box-shadow-error-focus: none;
  --jfi-form-control-border-style: solid;
  --jfi-form-control-color: #212529;
  --jfi-form-control-font-size: 1rem;
  --jfi-form-control-font-weight: 400;
  --jfi-form-control-line-height: 2;
  --jfi-form-control-margin: 0;
  --jfi-form-control-padding: .5rem .875rem;
  --jfi-error-message-color: #C12727;
  --jfi-error-message-margin: .25rem 0 0 0;
  --jfi-error-message-font-size: .875rem;
`;
