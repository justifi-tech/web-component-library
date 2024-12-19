export default {
  title: 'dev/Components/RefundForm',
  component: 'refund-form',
  argTypes: {
    authToken: { control: 'text' },
    paymentId: { control: 'text' },
    amount: { control: 'number' },
    submitButtonText: { control: 'text' },
    withButton: { control: 'boolean' },
    refundInfoText: { control: 'text' },
  },
};

const RefundFormTemplate = ({
  authToken,
  paymentId,
  amount,
  submitButtonText,
  withButton,
  refundInfoText,
}) => {
  return `
    <div>
      <justifi-refund-form
        auth-token="${authToken}"
        payment-id="${paymentId}"
        amount="${amount}"
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

export const Example = RefundFormTemplate.bind({});
Example.args = {
  authToken: '',
  paymentId: '',
  amount: 0,
  submitButtonText: 'Submit',
  withButton: true,
  refundInfoText: '',
};

export const Styled = RefundFormTemplate.bind({});
Styled.args = {
  authToken: '',
  paymentId: '',
  amount: 0,
  submitButtonText: 'Submit',
  withButton: true,
  refundInfoText: '',
};
