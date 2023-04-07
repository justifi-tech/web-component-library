export default {
  title: 'Components/PaymentForm',
  component: 'justifi-payment-form',
  parameters: {
    actions: {
      handles: [
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
  metadata: { something: "somevalue" } // optional
};

// IMPORTANT:
// Only use named functions when binding to event handlers. Otherwise, they will be bound multiple times
// Going forward, we could create a decorator that binds events
const handleSubmitClick = async () => {
  const paymentForm = document.querySelector('justifi-payment-form') as HTMLJustifiPaymentFormElement;
  const tokenizeResponse = await paymentForm.submit({ clientId: '123', paymentMethodData: paymentMethodData });
  console.log(tokenizeResponse);
}
const handleReadyClick = () => {
  const submitButton = document.querySelector('#submit-button');
  submitButton?.addEventListener('click', handleSubmitClick);
}
const addEvents = () => {
  addEventListener('cardFormReady', handleReadyClick);
}

const Template = () => {
  // The <div> here should be replaced by a `display` property in the cardForm potentially
  return (`
    <div>
      <justifi-payment-form />
    </div>
    <div>
      <button id="submit-button">Submit</button>
    </div>
  `);
};

export const Basic = Template.bind({});
Basic.args = {
  includeButtons: true
}
