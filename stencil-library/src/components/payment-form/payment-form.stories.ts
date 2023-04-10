const paymentMethodData = {
  name: 'John Doe',
  metadata: { something: "somevalue" } // optional
};

// IMPORTANT:
// Only use named functions when binding to event handlers. Otherwise, they will be bound multiple times
// Going forward, we could create a decorator that binds events
const handleSubmitClick = async () => {
  console.log('handleSubmitClick');
  const paymentForm = document.querySelector('justifi-payment-form') as HTMLJustifiPaymentFormElement;
  const tokenizeResponse = await paymentForm.submit({ clientId: '123', paymentMethodData: paymentMethodData });
  console.log(tokenizeResponse);
}
const handleReadyClick = () => {
  const submitButton = document.querySelector('#submit-button');
  submitButton?.addEventListener('click', handleSubmitClick);
}

const Template = (args: { 'bank-account': boolean, card: boolean }) => {
  // The <div> here should be replaced by a `display` property in the cardForm potentially
  return (`
    <div>
      <justifi-payment-form card=${args.card} bank-account=${args['bank-account']} />
    </div>
    <div>
      <button id="submit-button">Submit</button>
    </div>
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
        category: 'Tokenize Args'
      }
    },
    clientId: {
      control: 'text',
      table: {
        category: 'Tokenize Args'
      }
    },
    paymentMethodData: {
      control: 'object',
      table: {
        category: 'Tokenize Args'
      }
    },
  },
  parameters: {
    actions: {
      handles: [],
    },
  },
  decorators: [
    (story, { args }) => `
      ${story()}
      ${JSON.stringify(args)}
      <script>${handleReadyClick()}</script>
    `,
  ],
};

export const Basic = Template.bind({});
Basic.args = {
  'bank-account': true,
  card: true,
  clientId: '',
  paymentMethodData: {},
  accountId: ''
};
