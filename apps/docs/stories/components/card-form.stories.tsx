import type { Meta, StoryObj } from '@storybook/web-components';
import { withActions } from '@storybook/addon-actions/decorator';
import { StoryBaseArgs, paymentMethodFormComponentMethods } from '../utils';

import '@justifi/webcomponents/dist/module/justifi-card-form';

const storyBaseArgs = new StoryBaseArgs(['account-id', 'client-id', 'iframe-origin']);
storyBaseArgs.argTypes['client-id'].table.disable = true;

const meta: Meta = {
  title: 'Payment Facilitation/Payments/Card Form',
  component: 'justifi-card-form',
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
    'single-line': {
      type: 'boolean',
      description: '`boolean` indicating if the Card Form should render in a single line layout',
      control: {
        type: 'boolean'
      },
      table: {
        category: 'props'
      }
    },
    'validation-mode': {
      options: ['all', 'onBlur', 'onChange', 'onSubmit', 'onTouched'],
      control: { type: 'select' },
      description: 'When to trigger validation of the form. `\'all\' | \'onBlur\' | \'onChange\' | \'onSubmit\' | \'onTouched\'`',
      table: {
        category: 'props'
      }
    },
    'cardFormTokenize': {
      description: 'Emitted when the `tokenize` method is called on the component',
      table: {
        category: 'events'
      },
    },
    'cardFormValidate': {
      description: 'Emitted when the `validate` method is called on the component',
      table: {
        category: 'events'
      },
      action: true
    },
    'cardFormReady': {
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
        'cardFormTokenize',
        'cardFormValidate',
        'cardFormReady',
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

const handleValidateClick = async (cardForm: HTMLJustifiCardFormElement) => {
  await cardForm.validate();
};
const handleTokenizeClick = async (cardForm: HTMLJustifiCardFormElement, paymentMethodData: any) => {
  const clientId = storyBaseArgs.args['client-id'] || '';
  const accountId = storyBaseArgs.args['account-id'] || '';
  console.log('clientID', clientId);
  await cardForm.tokenize(clientId, paymentMethodData, accountId);
};

const handleReady = () => {
  const cardForm = document.querySelector('justifi-card-form') as HTMLJustifiCardFormElement;
  const validateBtn = document.querySelector('#validate-btn');
  const tokenizeBtn = document.querySelector('#tokenize-btn');
  validateBtn?.addEventListener('click', () => {
    handleValidateClick(cardForm);
  });
  tokenizeBtn?.addEventListener('click', () => {
    handleTokenizeClick(cardForm, { address_postal_code: '12345' });
  });
};

const addEvents = () => {
  addEventListener('cardFormReady', handleReady);
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
  const includeButtons = true;

  return `
    <div>
      <style>
      :root {
        ${args['css-variables'] || ''}
      }
      </style>
      <justifi-card-form
        data-testid="card-form-iframe"
        validation-mode="${args['validation-mode'] || 'onSubmit'}"
        single-line="${args['single-line']}"
      />
    </div>
    ${includeButtons ? FormButtons : ''}
  `;
};

export const Basic: StoryObj = {
  args: { ...storyBaseArgs.args, 'single-line': false },
  render: Template,
};

export const SingleLine: StoryObj = {
  args: { ...storyBaseArgs.args, 'single-line': true },
  render: Template,
};

const styledVariables = `
  --jfi-load-google-font: 'Inter:wght@200;400;700;900&family=Agdasima';
  --jfi-layout-font-family: Agdasima;
  --jfi-layout-padding: 4px;
  --jfi-layout-form-control-spacing-x: .5rem;
  --jfi-layout-form-control-spacing-y: 1rem;
  --jfi-form-label-font-weight: 100;
  --jfi-form-label-font-family: Inter;
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

export const Styled: StoryObj = {
  args: {
    ...storyBaseArgs.args,
    'css-variables': styledVariables
  },
  render: Template,
};

export default meta;
