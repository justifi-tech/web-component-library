import type { Meta } from '@storybook/web-components';
import { withActions } from '@storybook/addon-actions/decorator';
import { CSSVarsExample, StoryBaseArgs, paymentMethodFormComponentMethods } from '../utils';

import '@justifi/webcomponents/dist/module/justifi-card-form';

const storyBaseArgs = new StoryBaseArgs(['account-id', 'client-id', 'iframe-origin']);
storyBaseArgs.argTypes['client-id'].table.disable = true;

const themes: { [key: string]: any } = {
  basic: {},
  custom: CSSVarsExample,
}

const meta: Meta = {
  title: 'Payment Facilitation/Payments/Card Form',
  component: 'justifi-card-form',
  args: {
    ...storyBaseArgs.args,
    'theme': 'basic'
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
    'theme': {
      options: ['basic', 'custom'],
      control: { type: 'select' },
      table: {
        category: 'theming'
      }
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
    (_story, context) => {
      const includeButtons = true;
      const { args } = context;
      return `
        <div>
          <style>
          :root {
            ${themes[args.theme]}
          }
          </style>
          <justifi-card-form
            data-testid="card-form-iframe"
            validation-mode="${args['validation-mode'] || 'onSubmit'}"
            single-line="${args['single-line']}"
          />
        </div>
        ${includeButtons ? FormButtons : ''}
        <script>${addEvents()}</script>`;
    },
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


export const Example = {};

export default meta;
