interface PaymentFormStoryArgs {
  'bank-account': boolean,
  card: boolean,
  clientId: string,
  paymentMethodData: any,
  accountId: string,
  iframeOrigin: string,
  environment: string
}

const Template = (args: PaymentFormStoryArgs) => {
  // The <div> here should be replaced by a `display` property in the cardForm potentially
  return (`
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
    <div class="container py-4" style="max-width: 400px;">
      <h1>Make a payment</h1>
      <div class="row gy-3">
        <div class="col-12">
          <justifi-payment-form
            card=${args.card}
            bank-account=${args['bank-account']}
            iframe-origin=${args['iframe-origin']}
          />
        </div>
        <div class="col-12">
          <button class="btn btn-primary" type="submit" id="submit-button">Submit</button>
        </div>
      </div>
    </div>

    <script>
    (async () => {
      await customElements.whenDefined('justifi-payment-form');
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

export default {
  title: 'Components/PaymentForm',
  component: 'justifi-payment-form',
  argTypes: {
    'iframe-origin': {
      options: ['development', 'staging', 'production'],
      mapping: {
        development: 'http://localhost:3003/v2',
        staging: 'https://js.justifi-staging.com/v2',
        production: 'https://js.justifi.ai/v2',
      },
      control: { type: 'select' },
    },
    'bank-account': {
      control: 'boolean',
    },
    card: {
      control: 'boolean',
    },
    accountId: {
      control: 'text',
      table: {
        category: 'Submit arguments'
      }
    },
    clientId: {
      control: 'text',
      table: {
        category: 'Submit arguments'
      }
    },
    paymentMethodData: {
      control: 'object',
      table: {
        category: 'Submit arguments'
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

export const Basic = Template.bind({});
Basic.args = {
  'bank-account': true,
  card: true,
  clientId: '',
  paymentMethodData: {},
  accountId: '',
  'iframe-origin': 'development'
};
