const isDev = process.env.NODE_ENV === 'development';

interface PaymentFormStoryArgs {
  'bank-account': boolean,
  card: boolean,
  email: string,
  'client-id': string,
  'account-id': string,
  'submit-button-text': string,
  cssVariables: string,
}

export default {
  title: 'Components/PaymentForm',
  component: 'justifi-payment-form',
  argTypes: {
    'iframe-origin': {
      control: 'text',
      table: {
        disable: isDev ? false : true,
        category: 'props',
      }
    },
  },
};

const Template = (args: PaymentFormStoryArgs) => {
  // The <div> here should be replaced by a `display` property in the cardForm potentially
  return (`
    <div>
      <justifi-payment-form
        card=${args.card}
        bank-account='${args['bank-account']}'
        email='${args.email}'
        client-id='${args['client-id']}'
        account-id='${args['account-id']}'
        submit-button-text='${args['submit-button-text']}'
        iframe-origin='${args['iframe-origin']}'
      />
    </div>
    <style>
      :root {
        ${args.cssVariables}
      }
    </style>
    <script>
    (async () => {
      await customElements.whenDefined('justifi-payment-form');
      const paymentForm = document.querySelector('justifi-payment-form');
      paymentForm.addEventListener('submitted', async (event) => {
        // here is where you would submit a payment with the token
        console.log(event.detail);
        // after the payment succeeds or fails, the form submit button can be enabled again
        await paymentForm.enableSubmitButton();
      });
    })()
    </script>
  `);
};

export const Basic = Template.bind({});
Basic.args = {
  'bank-account': true,
  card: true,
  email: '',
  'client-id': '',
  'account-id': '',
  'submit-button-text': '',
  'iframe-origin': ''
};

export const Styled = Template.bind({});
Styled.args = {
  'bank-account': true,
  card: true,
  email: '',
  'client-id': '',
  'account-id': '',
  'submit-button-text': '',
  'iframe-origin': '',
  cssVariables: (`
  --jfi-primary-color: #212529;

  --jfi-layout-padding: 0;
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
  --jfi-submit-button-background-color: var(--jfi-primary-color);
  --jfi-submit-button-border-color: var(--jfi-primary-color);
  --jfi-submit-button-padding: 0.375rem 0.75rem;
  --jfi-submit-button-font-size: 1rem;
  --jfi-submit-button-border-radius: 4px;
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

  --jfi-radio-button-color: var(--jfi-primary-color);
  --jfi-radio-button-background-color: transparent;
  --jfi-radio-button-color-selected: white;
  --jfi-radio-button-background-color-selected: var(--jfi-primary-color);
  --jfi-radio-button-border-color: var(--jfi-primary-color);
  --jfi-radio-button-border-color-selected: var(--jfi-primary-color);
  --jfi-radio-button-padding: 0.375rem 0.75rem;
  --jfi-radio-button-font-size: 1rem;
  --jfi-radio-button-color-hover: var(--jfi-primary-color);
  --jfi-radio-button-color-selected-hover: white;
  --jfi-radio-button-background-color-hover: transparent;
  --jfi-radio-button-background-color-selected-hover: var(--jfi-primary-color);
  --jfi-radio-button-border-color-selected-hover: var(--jfi-primary-color);
  --jfi-radio-button-border-color-hover: var(--jfi-primary-color);
  --jfi-radio-button-group-width: 100%;
  `)
}
