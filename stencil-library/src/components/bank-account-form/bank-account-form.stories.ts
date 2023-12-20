import { config } from '../../../config';

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

export default {
  title: 'Components/BankAccountForm',
  component: 'justifi-bank-account-form',
  argTypes: {
    'css-variables': {
      control: 'text',
      table: {
        category: 'props',
        defaultValue: CSSVars,
      },
    },
    'resize': {
      description: 'Deprecated: This method will be removed in future releases.',
      table: {
        category: 'methods',
      },
    },
  },
  decorators: [
    story => `
      <!-- Deprecated Notice -->
      <p style="color: red; font-family: 'Roboto Mono', monospace;">Note: The 'resize' method is deprecated and will be removed in future releases.</p>
      ${story()}
      <script>${addEvents()}</script>
    `,
  ],
};

const handleValidateClick = async (bankForm: HTMLJustifiBankAccountFormElement) => {
  const valid = await bankForm.validate();
  console.log(valid);
};
const handleTokenizeClick = async (bankForm: HTMLJustifiBankAccountFormElement, paymentMethodData: any) => {
  const tokenizeResponse = await bankForm.tokenize('CLIENT_ID', paymentMethodData);
  console.log(tokenizeResponse);
};
const handleResizeClick = async (bankForm: HTMLJustifiBankAccountFormElement) => {
  await bankForm.resize();
};
const handleReady = () => {
  console.log('bank account form is ready');
  const bankForm = document.querySelector('justifi-bank-account-form') as HTMLJustifiBankAccountFormElement;
  const validateBtn = document.querySelector('#validate-btn');
  const tokenizeBtn = document.querySelector('#tokenize-btn');
  const resizeBtn = document.querySelector('#resize-btn');
  validateBtn?.addEventListener('click', () => {
    handleValidateClick(bankForm);
  });
  tokenizeBtn?.addEventListener('click', () => {
    handleTokenizeClick(bankForm, {});
  });
  resizeBtn?.addEventListener('click', () => {
    handleResizeClick(bankForm);
  });
};

const addEvents = () => {
  addEventListener('bankAccountFormReady', handleReady);
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
    }
  </style>
  <div class="button-bar">
    <button id="validate-btn">Validate</button>
    <button id="tokenize-btn">Tokenize</button>
    <button id="resize-btn">Resize</button>
  </div>
`;

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
        validation-mode='${args['validation-mode'] || 'onSubmit'}'
        iframe-origin='${config.iframeOrigin}'
      />
    </div>
    ${FormButtons}
  `;
};

export const Basic = Template.bind({});

export const Styled = Template.bind({});
Styled.args = {
  'css-variables': CSSVars,
};
