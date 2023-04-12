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

const handleValidateClick = async (cardForm: HTMLJustifiCardFormElement) => {
  const valid = await cardForm.validate();
  console.log(valid);
}
const handleTokenizeClick = async (cardForm: HTMLJustifiCardFormElement, paymentMethodData) => {
  const tokenizeResponse = await cardForm.tokenize('CLIENT_ID', paymentMethodData);
  console.log(tokenizeResponse);
}
const handleReady = () => {
  console.log('card form is ready');
  const cardForm = document.querySelector('justifi-card-form') as HTMLJustifiCardFormElement;
  const validateBtn = document.querySelector('#validate-btn');
  const tokenizeBtn = document.querySelector('#tokenize-btn');
  validateBtn?.addEventListener('click', () => { handleValidateClick(cardForm) });
  tokenizeBtn?.addEventListener('click', () => { handleTokenizeClick(cardForm, {}) });
}

export {
  FormButtons,
  handleReady
};
