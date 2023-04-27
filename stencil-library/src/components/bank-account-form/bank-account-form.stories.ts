const isDev = process.env.NODE_ENV === 'development';

export default {
  title: 'Components/BankAccountForm',
  component: 'justifi-bank-account-form',
  argTypes: {
    'iframe-origin': {
      control: 'text',
      table: {
        disable: isDev ? false : true,
        category: 'props',
      }
    },
  },
  decorators: [
    (story) => `
      ${story()}
      <script>${addEvents()}</script>
    `,
  ],
};

const handleValidateClick = async (bankForm: HTMLJustifiBankAccountFormElement) => {
  const valid = await bankForm.validate();
  console.log(valid);
}
const handleTokenizeClick = async (bankForm: HTMLJustifiBankAccountFormElement, paymentMethodData: any) => {
  const tokenizeResponse = await bankForm.tokenize('CLIENT_ID', paymentMethodData);
  console.log(tokenizeResponse);
}
const handleReady = () => {
  console.log('bank account form is ready');
  const bankForm = document.querySelector('justifi-bank-account-form') as HTMLJustifiBankAccountFormElement;
  const validateBtn = document.querySelector('#validate-btn');
  const tokenizeBtn = document.querySelector('#tokenize-btn');
  validateBtn?.addEventListener('click', () => { handleValidateClick(bankForm) });
  tokenizeBtn?.addEventListener('click', () => { handleTokenizeClick(bankForm, {}) });
}

const addEvents = () => {
  addEventListener('bankAccountFormReady', handleReady);
}

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
  </div>
`

const Template = (args: any) => {
  return (`
    <div>
      <justifi-bank-account-form
        data-testid="bank-account-form-iframe"
        validation-mode='${args['validation-mode'] || 'onSubmit'}'
        iframe-origin='${args['iframe-origin'] || ''}'
      />
    </div>
    ${FormButtons}
  `);
};

export const Basic = Template.bind({});
