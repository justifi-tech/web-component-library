import type { Meta } from '@storybook/web-components';
import { withActions } from '@storybook/addon-actions/decorator';
import { CSSVarsExample, StoryBaseArgs, paymentMethodFormComponentMethods } from '../utils';

import '@justifi/webcomponents/dist/module/justifi-card-form';

const storyBaseArgs = new StoryBaseArgs(['account-id', 'client-id', 'iframe-origin', 'custom-styled']);
storyBaseArgs.argTypes['client-id'].table.disable = true;

const meta: Meta = {
  title: 'Payment Facilitation/Payments/Card Form',
  component: 'justifi-card-form',
  args: {
    ...storyBaseArgs.args,
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
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
        ${args['custom-styled'] ? args['css-variables'] : ''}
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

Template.args = { ...storyBaseArgs.args, 'css-variables': CSSVarsExample };

export const Basic = Template;

export default meta;
