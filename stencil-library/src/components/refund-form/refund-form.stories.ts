export default {
  title: 'Pre-release Components/RefundForm',
  component: 'refund-form',
  argTypes: {
    authToken: { control: 'text' },
    paymentId: { control: 'text' },
    submitButtonText: { control: 'text' },
    withButton: { control: 'boolean' },
    refundInfoText: { control: 'text' },
  },
};

const RefundFormTemplate = ({
  authToken,
  paymentId,
  submitButtonText,
  withButton,
  refundInfoText,
  cssVariables,
}) => {
  return `
    <div>
      <justifi-refund-form
        auth-token="${authToken}"
        payment-id="${paymentId}"
        submit-button-text="${submitButtonText}"
        ${withButton ? 'with-button' : ''}
        refund-info-text="${refundInfoText}"
      ></justifi-refund-form>
      ${
        !withButton
          ? `<button id="custom-submit" type="button" class="btn btn-primary">Custom Submit</button>`
          : ''
      }
    </div>
    <style>
      :root {
        ${cssVariables || ''}
      }

      #custom-submit {
        color: #fff;
        background-color: #007bff;
        border-color: #007bff;
        display: inline-block;
        font-weight: 400;
        text-align: center;
        vertical-align: middle;
        user-select: none;
        background-clip: border-box;
        border: 1px solid transparent;
        padding: .375rem .75rem;
        font-size: 1rem;
        line-height: 1.5;
        border-radius: .25rem;
        transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
        margin-top: 1rem;
      }

      #custom-submit:hover {
        color: #fff;
        background-color: #0069d9;
        border-color: #0062cc;
      }

      #custom-submit:focus {
        outline: 0;
        box-shadow: 0 0 0 .2rem rgba(0,123,255,.25);
      }

      #custom-submit:disabled {
        color: #fff;
        background-color: #007bff;
        border-color: #007bff;
        opacity: .65;
      }
    </style>
    <script>
    function listenSubmittedEvent() {
      const refundForm = document.querySelector('refund-form');
      refundForm.addEventListener('submitted', (event) => {
        console.log(event.detail);
      });
    }

    function bindCustomSubmitButton() {
      const externalSubmitButton = document.getElementById('custom-submit');
      if (externalSubmitButton) {
        externalSubmitButton.addEventListener('click', async () => {
          const refundForm = document.querySelector('refund-form');
          refundForm.submit();
        });
      }
    }

    (async () => {
      await customElements.whenDefined('refund-form');
      listenSubmittedEvent();
      bindCustomSubmitButton();
    })();
    </script>
  `;
};

export const Basic = RefundFormTemplate.bind({});
Basic.args = {
  authToken: '',
  paymentId: '',
  submitButtonText: 'Submit',
  withButton: true,
  refundInfoText: '',
  cssVariables: '',
};

export const Styled = RefundFormTemplate.bind({});
Styled.args = {
  authToken: '',
  paymentId: '',
  submitButtonText: 'Submit',
  withButton: true,
  refundInfoText: '',
  cssVariables: `
    --jfi-primary-color: #212529;
    --jfi-load-google-font: 'Roboto Mono:wght@200;400;700;900';
    --jfi-layout-font-family: Roboto Mono, Calibri, sans-serif;
    --jfi-layout-padding: 4px;
    --jfi-layout-form-control-spacing-x: .5rem;
    --jfi-layout-form-control-spacing-y: 1rem;
    --jfi-form-label-font-weight: 700;
    --jfi-form-label-font-family: Calibri, sans-serif;
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

    --jfi-submit-button-color: white;
    --jfi-submit-button-background-color: #3F3F47;
    --jfi-submit-button-border-color: var(--jfi-primary-color);
    --jfi-submit-button-padding: 0.375rem 0.75rem;
    --jfi-submit-button-font-size: 1rem;
    --jfi-submit-button-border-radius: 1px;
    --jfi-submit-button-color-hover: white;
    --jfi-submit-button-background-color-hover: var(--jfi-primary-color);
    --jfi-submit-button-border-color-hover: var(--jfi-primary-color);
    --jfi-submit-button-color-focus: white;
    --jfi-submit-button-background-color-focus: var(--jfi-primary-color);
    --jfi-submit-button-border-color-focus: var(--jfi-primary-color);
    --jfi-submit-button-color-active: white;
    --jfi-submit-button-background-color-active: var(--jfi-primary-color);
    --jfi-submit-button-border-color-active: var(--jfi-primary-color);
    --jfi-submit-button-width: 100%;
    --jfi-submit-button-box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
  `,
};
