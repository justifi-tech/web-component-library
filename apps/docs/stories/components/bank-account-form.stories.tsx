import type { Meta } from '@storybook/web-components';
import { withActions } from '@storybook/addon-actions/decorator';
import { paymentMethodFormComponentMethods, StoryBaseArgs } from '../utils';

import '@justifi/webcomponents/dist/module/justifi-bank-account-form';

const storyBaseArgs = new StoryBaseArgs(['account-id', 'client-id', 'iframe-origin']);
storyBaseArgs.argTypes['client-id'].table.disable = true;
storyBaseArgs.argTypes['account-id'].table.disable = true;

const meta: Meta = {
  title: 'Payment Facilitation/Payments/Bank Account Form',
  component: 'justifi-bank-account-form',
  args: {
    ...storyBaseArgs.args
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
    'css-variables': {
      table: {
        disable: true
      },
    },
    'validation-mode': {
      options: ['all', 'onBlur', 'onChange', 'onSubmit', 'onTouched'],
      control: { type: 'select' },
      description: 'When to trigger validation of the form. `\'all\' | \'onBlur\' | \'onChange\' | \'onSubmit\' | \'onTouched\'`',
      table: {
        category: 'props'
      }
    },
    'bankAccountFormTokenize': {
      description: 'Emitted when the `tokenize` method is called on the component',
      table: {
        category: 'events'
      },
    },
    'bankAccountFormValidate': {
      description: 'Emitted when the `validate` method is called on the component',
      table: {
        category: 'events'
      },
      action: true
    },
    'bankAccountFormReady': {
      description: 'Emitted when iframe content has loaded. This event is deprecated in favor of the `ready` event and will be removed in a future release',
      table: {
        category: 'events'
      }
    },
    'ready': {
      description: 'Emitted when iframe content has loaded',
      table: {
        category: 'events'
      }
    },
    ...paymentMethodFormComponentMethods
  },
  parameters: {
    actions: {
      handles: [
        'bankAccountFormTokenize',
        'bankAccountFormValidate',
        'bankAccountFormReady',
        'ready'
      ]
    },
    chromatic: {
      delay: 2000,
    },
  },
  decorators: [
    story => `
    ${story()}
    <script>${addEvents()}</script>`,
    // @ts-ignore
    withActions
  ],
};

const handleValidateClick = async (bankForm: HTMLJustifiBankAccountFormElement) => {
  await bankForm.validate();
};

const handleTokenizeClick = async (bankForm: HTMLJustifiBankAccountFormElement, paymentMethodData: any) => {
  const clientId = storyBaseArgs.args['client-id'] || '';
  const accountId = storyBaseArgs.args['account-id'] || '';
  await bankForm.tokenize(clientId, paymentMethodData, accountId);
};

const handleReady = () => {
  const bankForm = document.querySelector('justifi-bank-account-form') as HTMLJustifiBankAccountFormElement;
  const validateBtn = document.querySelector('#validate-btn');
  const tokenizeBtn = document.querySelector('#tokenize-btn');

  validateBtn?.addEventListener('click', () => {
    handleValidateClick(bankForm);
  });
  tokenizeBtn?.addEventListener('click', () => {
    handleTokenizeClick(bankForm, { account_owner_name: 'John Doe' });
  });
};

const addEvents = () => {
  addEventListener('bankAccountFormReady', handleReady);
};

const CSSVars = `
--jfi-load-google-font: 'Roboto Mono:wght@200;400;700;900&family=Agdasima';
--jfi-layout-font-family: Roboto Mono;
--jfi-layout-padding: 4px;
--jfi-layout-form-control-spacing-x: .5rem;
--jfi-layout-form-control-spacing-y: 1rem;
--jfi-form-label-font-weight: 700;
--jfi-form-label-font-family: sans-serif;
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

const FormButtons = `
  <style>
    .button-bar { margin-top: 10px;}
    .button-bar button { margin-right: 10px; }
  </style>
  <div class="button-bar">
    <button id="validate-btn">Test Validate</button>
    <button id="tokenize-btn">Test Tokenize</button>
  </div>`;

const Template = (args: any) => {
  return `
    <div>
      <style>
      :root {
        ${args['css-variables'] || ''}
      }
      </style>
      <justifi-bank-account-form
        data-testid="bank-account-form-iframe"
        validation-mode="${args['validation-mode'] || 'onSubmit'}"
      />
    </div>
    ${FormButtons}
  `;
};

// This fixes a typescript error
Template.args = { ...storyBaseArgs.args, 'css-variables': '' };

export const Basic = Template.bind({});

export const Styled = Template.bind({});
Styled.args = {
  'css-variables': CSSVars
};

export default meta;
