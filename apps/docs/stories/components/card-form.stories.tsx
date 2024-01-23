import type { Meta } from '@storybook/web-components';
import { withActions } from '@storybook/addon-actions/decorator';
import { StoryBaseArgs } from '../utils';

import '@justifi/webcomponents/dist/module/justifi-card-form';

const storyBaseArgs = new StoryBaseArgs(['account-id', 'auth-token']);

const meta: Meta = {
  title: 'Components/CardForm',
  component: 'justifi-card-form',
  args: {
    ...storyBaseArgs.args,
    'iframe-origin': '',
    'single-line': false,
    'validation-mode': 'onSubmit'
  },
  argTypes: {
    ...storyBaseArgs.argTypes,
    'iframe-origin': {
      type: 'string',
      description: 'URL for the rendered iFrame. End-users need not use this.',
      control: {
        type: 'text',
      },
      table: {
        category: 'props',
      }
    },
    'single-line': {
      type: 'boolean',
      description: 'Boolean indicating if the Card Form should render in a single line',
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
      description: 'When to trigger validation of the form.',
      table: {
        category: 'props'
      }
    },
    'cardFormTokenize': {
      description: 'Triggered when the tokenize method is called on the component',
      table: {
        category: 'events'
      },
    },
    'cardFormValidate': {
      description: 'Triggered when the validate method is called on the component',
      table: {
        category: 'events'
      },
      action: true
    },
    'ready': {
      description: 'Triggered when iframe has loaded',
      table: {
        category: 'events'
      }
    },
    'resize': {
      description: 'Deprecated: This method will be removed in future releases.',
      table: {
        category: 'methods',
      }
    },
    'tokenize': {
      description: 'Makes a tokenization request to the iframe',
      table: {
        category: 'methods'
      }
    },
    'validate': {
      description: 'Runs a validation on the form and shows errors if any',
      table: {
        category: 'methods'
      }
    }
  },
  parameters: {
    actions: {
      handles: [
        'cardFormTokenize',
        'cardFormValidate',
        'cardFormReady',
        'ready'
      ]
    }
  },
  decorators: [
    story => `
    ${story()}
    <script>${addEvents()}</script>`,
    withActions
  ],
};

const handleValidateClick = async (cardForm: HTMLJustifiCardFormElement) => {
  await cardForm.validate();
};
const handleTokenizeClick = async (cardForm: HTMLJustifiCardFormElement, paymentMethodData: any) => {
  await cardForm.tokenize('CLIENT_ID', paymentMethodData);
};

const handleReady = () => {
  const cardForm = document.querySelector('justifi-card-form') as HTMLJustifiCardFormElement;
  const validateBtn = document.querySelector('#validate-btn');
  const tokenizeBtn = document.querySelector('#tokenize-btn');
  validateBtn?.addEventListener('click', () => {
    handleValidateClick(cardForm);
  });
  tokenizeBtn?.addEventListener('click', () => {
    handleTokenizeClick(cardForm, {});
  });
};

const addEvents = () => {
  addEventListener('cardFormReady', handleReady);
};

const FormButtons = `
  <style>
    .button-bar {
      display: flex;
      aligin-items: center;
      padding: 10px;
    }
    .button-bar button {
      margin-right: 10px;
      border-radius: 3px;
      border: 1px solid black;
    }
  </style>
  <div class="button-bar">
    <button id="validate-btn">Validate</button>
    <button id="tokenize-btn">Tokenize</button>
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
        validation-mode='${args['validation-mode'] || 'onSubmit'}'
        single-line='${args['single-line']}'
      />
    </div>
    ${includeButtons ? FormButtons : ''}
  `;
};

export const Basic = Template.bind({});
Basic.args = {
  'validation-mode': 'onSubmit',
  'single-line': false,
};

export const SingleLine = Template.bind({});
SingleLine.args = {
  'single-line': true,
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

export const Styled = Template.bind({});
Styled.args = {
  'single-line': false,
  'css-variables': styledVariables,
};

export default meta;
