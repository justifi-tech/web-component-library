import type { Meta } from '@storybook/web-components';
import { withActions } from '@storybook/addon-actions/decorator';
import { CSSVarsExample, paymentMethodFormComponentMethods, StoryBaseArgs } from '../utils';

import '@justifi/webcomponents/dist/module/justifi-bank-account-form';

const storyBaseArgs = new StoryBaseArgs(['account-id', 'client-id', 'iframe-origin', 'custom-styled']);
storyBaseArgs.argTypes['client-id'].table.disable = true;
storyBaseArgs.argTypes['account-id'].table.disable = true;

const meta: Meta = {
  title: 'Payment Facilitation/Payments/Bank Account Form',
  component: 'justifi-bank-account-form',
  args: {
    ...storyBaseArgs.args,
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
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
    ...paymentMethodFormComponentMethods,
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
        ${args['custom-styled'] ? args['css-variables'] : ''}
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
Template.args = { ...storyBaseArgs.args, 'css-variables': CSSVarsExample };

export const Basic = Template;

export default meta;
