interface PaymentFormStoryArgs {
  'bank-account': boolean,
  card: boolean,
  clientId: string,
  paymentMethodData: any,
  accountId: string,
  iframeOrigin: string,
  cssVariables: string
}

export default {
  title: 'Components/PaymentForm',
  component: 'justifi-payment-form',
  argTypes: {
    'bank-account': {
      control: 'boolean',
      table: {
        category: 'Props'
      }
    },
    card: {
      control: 'boolean',
      table: {
        category: 'Props'
      }
    },
    accountId: {
      control: 'text',
      table: {
        category: 'Tokenize Arguments'
      }
    },
    clientId: {
      control: 'text',
      table: {
        category: 'Tokenize Arguments'
      }
    },
    paymentMethodData: {
      control: 'object',
      table: {
        category: 'Tokenize Arguments'
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
      <justifi-payment-form card=${args.card} bank-account=${args['bank-account']} />
    </div>
    <div>
      <button id="submit-button">Submit</button>
    </div>
    <style>
      :root {
        ${args.cssVariables}
      }
    <script>
    (async () => {
      await customElements.whenDefined('justifi-payment-form');
      const paymentForm = document.querySelector('justifi-payment-form');
      const submitButton = document.querySelector('#submit-button');

      submitButton?.addEventListener('click', async () => {
        const tokenizeResponse = await paymentForm.submit({
          clientId: '${args.clientId}',
          paymentMethodData: ${JSON.stringify(args.paymentMethodData)},
          accountId: '${args.accountId}'
        });
        console.log('tokenizeResponse:', tokenizeResponse);
      });
    })()
    </script>
  `);
};

export const Basic = Template.bind({});
Basic.args = {
  'bank-account': true,
  card: true,
  clientId: '',
  paymentMethodData: {},
  accountId: '',
  iframeOrigin: ''
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
  `)
}