interface PaymentFormStoryArgs {
  'bank-account': boolean,
  card: boolean,
  clientId: string,
  paymentMethodData: any,
  accountId: string,
  address_line1: string
}

const Template = (args: PaymentFormStoryArgs) => {
  // The <div> here should be replaced by a `display` property in the cardForm potentially
  return (`
    <div>
      <justifi-payment-form card=${args.card} bank-account=${args['bank-account']} />
    </div>
    <div>
      <button id="submit-button">Submit</button>
    </div>
    <script>
    (async () => {
      await customElements.whenDefined('justifi-payment-form');
      const paymentForm = document.querySelector('justifi-payment-form');
      const submitButton = document.querySelector('#submit-button');

      paymentForm.fillBillingForm({
        address_line1: ${args.address_line1 || '\"\"'}
      });

      submitButton?.addEventListener('click', async () => {
        const tokenizeResponse = await paymentForm.submit({
          clientId: ${args.clientId || '\"\"'},
          paymentMethodData: ${JSON.stringify(args.paymentMethodData)},
          accountId: ${args.accountId || '\"\"'}
        });
        console.log('tokenizeResponse:', tokenizeResponse);
      });
    })()
    </script>
  `);
};

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
    address_line1: {
      control: 'text',
      table: {
        category: 'Billing Form'
      }
    }
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

export const Basic = Template.bind({});
Basic.args = {
  'bank-account': true,
  card: true,
  clientId: '',
  paymentMethodData: {},
  accountId: '',
  address_line1: ''
};
