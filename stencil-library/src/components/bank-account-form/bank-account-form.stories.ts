export default {
  title: 'Components/BankAccountForm',
  component: 'justifi-bank-account-form',
  parameters: {

  },
  // Hide the iframe-origin prop so it's not shown in the docs or the stories
  argTypes: {
    'iframe-origin': {
      table: {
        disable: true
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

const storyStyleOverrides = {
  "layout": {
    "padding": "100px",
    "formControlSpacingHorizontal": ".5rem",
    "formControlSpacingVertical": "1rem"
  },
  "formLabel": {
    "fontWeight": "700",
    "fontFamily": "sans-serif",
    "margin": "0 0 .5rem 0"
  },
  "formControl": {
    "backgroundColor": "#00F4F6",
    "backgroundColorHover": "#EEEEF5",
    "borderColor": "rgba(0, 0, 0, 0.42)",
    "borderColorHover": "rgba(0, 0, 0, 0.62)",
    "borderColorFocus": "#fccc32",
    "borderColorError": "#C12727",
    "borderWidth": "0px",
    "borderBottomWidth": "1px",
    "borderRadius": "40px 4px 0 0",
    "borderStyle": "solid",
    "boxShadowErrorFocus": "none",
    "boxShadowFocus": "none",
    "color": "#212529",
    "fontSize": "1rem",
    "fontWeight": "400",
    "lineHeight": "2",
    "margin": "0",
    "padding": ".5rem .875rem"
  },
  "errorMessage": {
    "color": "#C12727",
    "margin": ".25rem 0 0 0",
    "fontSize": ".875rem"
  }
};

const Template = ({
  includeButtons = true,
  styleOverrides
}: {
  includeButtons: boolean,
  styleOverrides?: object
}) => {
  const parsedStyleOverrides = styleOverrides ? JSON.stringify(styleOverrides) : null;

  return (`
    <div>
      <justifi-bank-account-form data-testid="bank-account-form-iframe" style-overrides='${parsedStyleOverrides || ''}' />
    </div>
    ${includeButtons ? FormButtons : ''}
  `);
};

export const Basic = Template.bind({});

export const Styled = Template.bind({});
Styled.args = {
  styleOverrides: storyStyleOverrides
}
