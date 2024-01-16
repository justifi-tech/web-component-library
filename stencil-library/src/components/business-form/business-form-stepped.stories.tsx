import { config } from '../../../config';

class BusinessFormSteppedStoryArgs {
  'auth-token': string;
  'account-id': string;
  'bussiness-id': string;
  'css-variables': string;

  constructor(args) {
    this['auth-token'] = args['auth-token'] || config.proxyAuthToken;
    this['business-id'] = args['business-id'] || '';
    this['account-id'] = args['account-id'] || config.exampleAccountId;
    this['css-variables'] = args['css-variables'] || '';
  }
}

export default {
  title: 'Components/BusinessFormStepped',
  component: 'justifi-business-form',
  argTypes: {
    'auth-token': {
      control: 'text',
      table: {
        category: 'props',
      },
    },
    'account-id': {
      control: 'text',
      table: {
        category: 'props',
      },
    },
    'business-id': {
      control: 'text',
      table: {
        category: 'props',
      },
    }
  },
};

const Template = (args: BusinessFormSteppedStoryArgs) => {
  const authToken = args['auth-token'];
  const businessId = args['business-id'];
  const accountId = args['account-id'] || config.exampleAccountId;
  // The <div> here should be replaced by a `display` property in the cardForm potentially
  return `
    <div>
      <justifi-business-form-stepped
        auth-token="${authToken}"
        business-id="${businessId}"
        account-id="${accountId}"
        test-mode="true"
      />
    </div>
    <style>
      :root {
        ${args['css-variables']}
      }
    </style>
  `;
};

export const Basic = Template.bind({});

Basic.args = new BusinessFormSteppedStoryArgs({});

export const Styled = Template.bind({});
Styled.args = new BusinessFormSteppedStoryArgs({
  'auth-token': '',
  'business-id': '',
  'account-id': '',
  'cssVariables': `
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

  --jfi-submit-button-color: white;
  --jfi-submit-button-background-color: #3F3F47;
  --jfi-submit-button-border-color: var(--jfi-primary-color);
  --jfi-submit-button-padding: 0.375rem 0.75rem;
  --jfi-submit-button-font-size: 1rem;
  --jfi-submit-button-border-radius: 1px;
  --jfi-submit-button-color-hover: white;
  --jfi-submit-button-background-color-hover: var(--jfi-primary-color);
  --jfi-submit-button-border-color-hover: var(--jfi-primary-color);
  --jfi-submit-button-color-focus: white;
  --jfi-submit-button-background-color-focus: var(--jfi-primary-color);
  --jfi-submit-button-border-color-focus: var(--jfi-primary-color);
  --jfi-submit-button-color-active: white;
  --jfi-submit-button-background-color-active: var(--jfi-primary-color);
  --jfi-submit-button-border-color-active: var(--jfi-primary-color);
  --jfi-submit-button-width: 100%;
  --jfi-submit-button-box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;

  --jfi-radio-button-color: var(--jfi-primary-color);
  --jfi-radio-button-background-color: transparent;
  --jfi-radio-button-color-selected: white;
  --jfi-radio-button-background-color-selected: var(--jfi-primary-color);
  --jfi-radio-button-border-color: var(--jfi-primary-color);
  --jfi-radio-button-border-color-selected: var(--jfi-primary-color);
  --jfi-radio-button-padding: 0.375rem 0.75rem;
  --jfi-radio-button-font-size: 1rem;
  --jfi-radio-button-color-hover: var(--jfi-primary-color);
  --jfi-radio-button-color-selected-hover: white;
  --jfi-radio-button-background-color-hover: transparent;
  --jfi-radio-button-background-color-selected-hover: var(--jfi-primary-color);
  --jfi-radio-button-border-color-selected-hover: var(--jfi-primary-color);
  --jfi-radio-button-border-color-hover: var(--jfi-primary-color);
  --jfi-radio-button-group-width: 100%;
  `,
});
