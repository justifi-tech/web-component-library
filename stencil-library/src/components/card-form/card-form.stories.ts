export default {
  title: 'Components/CardForm',
  component: 'justifi-card-form',
  parameters: {
    actions: {
      handles: [
        'cardFormReady',
        'cardFormValidate',
        'cardFormTokenize'
      ],
    },
  },
  decorators: [
    (story) => `
      ${story()}
      <script>${addEvents()}</script>
    `,
  ],
};

const paymentMethodData = {
  name: 'John Doe',
};

// IMPORTANT:
// Only use named functions when binding to event handlers. Otherwise, they will be bound multiple times

const handleValidateClick = () => {
  const cardForm = document.querySelector('justifi-card-form') as HTMLJustifiCardFormElement;
  cardForm.validate();
  console.log('validate');
}

const handleTokenizeClick = async () => {
  const cardForm = document.querySelector('justifi-card-form') as HTMLJustifiCardFormElement;
  const tokenizeResponse = await cardForm.tokenize('CLIENT_ID', paymentMethodData);
  console.log(tokenizeResponse);
}

const handleReadyClick = () => {
  const validateBtn = document.querySelector('#validate-btn');
  const tokenizeBtn = document.querySelector('#tokenize-btn');
  validateBtn?.addEventListener('click', handleValidateClick);
  tokenizeBtn?.addEventListener('click', handleTokenizeClick);
}

const addEvents = () => {
  addEventListener('cardFormReady', handleReadyClick);
}

const buttons = `
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

const Template = () => {
  // // Alternate way of doing it
  // const cardForm = document.createElement('justifi-card-form') as HTMLJustifiCardFormElement;

  return (`
    <div>
      <justifi-card-form />
    </div>
  `);
};

export const Basic = Template.bind({});

export const Embedded = () => {
  return `
    <style>
      #wrapper {
        background-color: #aaaaaa;
      }
    </style>
    <div id="wrapper" style="width: 50%;">
      ${Template()}
    </div>
    ${buttons}
  `;
};

