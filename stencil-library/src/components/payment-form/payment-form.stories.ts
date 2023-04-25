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
  parameters: {
    actions: {
      handles: [],
    },
  },
  decorators: [
    (story) => story(),
  ],
};

const Template = (args: PaymentFormStoryArgs) => {
  // The <div> here should be replaced by a `display` property in the cardForm potentially
  return (`
    <div>
      <justifi-payment-form
        card=${args.card}
        bank-account='${args['bank-account'] || ''}'
        email='${args.email || ''}'
        client-id='${args['client-id'] || ''}'
        account-id='${args['account-id'] || ''}'
        submit-button-text='${args['submit-button-text'] || ''}'
        iframe-origin='${args['iframe-origin'] || ''}'
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
      paymentForm.addEventListener('onSubmitted', (data) => {
        // here is where you would submit a payment with the token
        console.log('data');
      });
    })()
    </script>
  `);
};

export const Basic = Template.bind({});
Basic.args = {
  'bank-account': true,
  card: true,
};

export const Styled = Template.bind({});
Styled.args = {
  cssVariables: (`
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
  --jfi-btn-primary-bg-color: rgb(63, 63, 71);
  --jfi-btn-padding: 8px 16px;
  --jfi-btn-font-family: inherit;
  --jfi-btn-font-size: 14px;
  --jfi-btn-line-height: 20px;
  --jfi-btn-white-space: no-break;
  --jfi-btn-border-width: 0;
  --jfi-btn-font-weight: 600;
  --jfi-btn-text-transform: uppercase;
  --jfi-btn-box-shadow: rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px;
  --jfi-btn-focus-box-shadow: rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px;
  --jfi-btn-disabled-opacity: .5;
  --jfi-btn-active-box-shadow: rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px;
  --jfi-btn-border-radius: 0;
  --jfi-btn-transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  `)
}
