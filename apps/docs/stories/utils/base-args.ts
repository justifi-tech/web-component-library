type ArgNames =
  | 'auth-token'
  | 'account-id'
  | 'business-id'
  | 'client-id'
  | 'checkout-id'
  | 'iframe-origin'
  | 'payment-id'
  | 'payout-id'
  | 'theme';
type ArgValues = { [key in ArgNames]?: any };
type ArgTypes = { [key in ArgNames]?: any };

const args: ArgValues = {
  'account-id': 'acc_abc123',
  'auth-token': 'abc123',
  'business-id': 'biz_abc123',
  'client-id': 'test_abc123',
  'checkout-id': 'cho_abc123',
  'payment-id': 'py_abc123',
  'payout-id': 'po_abc123',
  theme: 'basic',
};

const argTypes: ArgTypes = {
  'auth-token': {
    type: 'string',
    description: 'Auth token `string`. See Authorization below',
    control: {
      type: 'text',
    },
    table: {
      category: 'props',
    },
  },
  'account-id': {
    type: 'string',
    description: 'Account ID `string`',
    control: {
      type: 'text',
    },
    table: {
      category: 'props',
    },
  },
  'business-id': {
    type: 'string',
    description:
      'Business ID `string`, the id of the business you create via API',
    control: {
      type: 'text',
    },
    table: {
      category: 'props',
    },
  },
  'checkout-id': {
    type: 'string',
    description: 'Checkout ID `string`',
    control: {
      type: 'text',
    },
    table: {
      category: 'props',
    },
  },
  'client-id': {
    type: 'string',
    description: 'Client ID `string`',
    control: {
      type: 'text',
    },
    table: {
      category: 'props',
    },
  },
  'iframe-origin': {
    table: {
      disable: true,
    },
  },
  'payment-id': {
    type: 'string',
    description: 'Payment ID `string`',
    control: {
      type: 'text',
    },
    table: {
      category: 'props',
    },
  },
  'payout-id': {
    type: 'string',
    description: 'Payout ID `string`',
    control: {
      type: 'text',
    },
    table: {
      category: 'props',
    },
  },
  theme: {
    options: ['basic', 'custom'],
    control: { type: 'select' },
    description:
      'Select a theme to preview the component in. [See example](https://storybook.justifi.ai/?path=/docs/introduction--docs#styling)',
    table: {
      category: 'theming',
    },
  },
};

export class StoryBaseArgs {
  args: ArgValues = {};
  argTypes: ArgTypes = {};

  constructor(argKeys: ArgNames[]) {
    argKeys.forEach((key) => {
      this.args[key] = args[key];
      this.argTypes[key] = argTypes[key];
    });
  }
}

export const paymentMethodFormComponentMethods = {
  resize: {
    description:
      "Triggers the iframe to compute it's height based on it's content and resize. This method is deprecated and will be removed in a future release in favor of better automatic resizing",
    table: {
      category: 'methods',
    },
  },
  validate: {
    description:
      'Asynchronous. Triggers validation on the form and shows errors if any, and returns a promise that resolves with `{ isValid: <boolean> }`',
    table: {
      category: 'methods',
    },
  },
  tokenize: {
    description:
      'Asynchronous. Triggers validation, then tokenization of payment method information if it passes client side validation. Returns a promise that resolves with the [tokenization request response body](https://developer.justifi.ai/tag/Payments#operation/CreatePayment). `tokenize(CLIENT_ID, PAYMENT_METHOD_METADATA, ACCOUNT_ID)`',
    table: {
      category: 'methods',
    },
  },
};
