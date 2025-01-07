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
  'account-id': 'acc_5Et9iXrSSAZR2KSouQGAWi',
  'auth-token':
    'eyJraWQiOiJqdXN0aWZpLWUyNDgyMmU3ODE1MmEzZjRkMjU1IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguanVzdGlmaS5haS8iLCJhenAiOiJ3Y3RfajNtaldpQWdvTm9ocVF6QXNKZnA3Iiwic3ViIjoid2N0X2ozbWpXaUFnb05vaHFRekFzSmZwN0BzZXNzaW9ucyIsImF1ZCI6Imh0dHBzOi8vYXBpLmp1c3RpZmkuYWkvdjEiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMiLCJwZXJtaXNzaW9ucyI6WyJ3cml0ZTpidXNpbmVzczpiaXpfNXU4SHZ5S28zRk5RRE5aYVBCR3B1OSJdLCJleHAiOjE3MzYyODUzNDcsImlhdCI6MTczNjI4MTc0NywicGxhdGZvcm1fYWNjb3VudF9pZCI6ImFjY181dTVEdXMzOU1lYjFxcVNzdTVVN3FTIn0.JOkTYuALkf7TaN6UPbTEALMtZC9nGItNW0k_HiGYREx8QpSztQIWlaHk1zv5C-ALN9_BbKfdc8Kyme-F_xre5ZJKv0FHMTWqNw8ag_9O7KyC5DwItViGZwcn9KDSq8qY1CjrImBdyS7AJwap_kd-WZhAHv4lEnQ6e7B_h3Vb0dBsikCugFbs2QrossVNO4ThIMNMLA8FxZ67KVyCsniSKKkazY3QakhRwBo7Y9uNnhmYWWWBLsbcfVgB0KikbFQWwOuWQLaT0hjsEvdRuqtOGBz2hcvZ2bg8T8EMeArHUjH4pLdtAfv37Uw0w7hkeYpLy7IYro6qlYDFqO88IkMGYg',
  'business-id': 'biz_5u8HvyKo3FNQDNZaPBGpu9',
  'client-id': 'test_df97f04afebc3c018de30df3562d7cdd',
  'checkout-id': 'cho_2ikwE6SeYWBHMSNnWudjki',
  'payment-id': 'py_1NNeEnf4FbelxDCQN2RHcE',
  'payout-id': 'po_17745yESnHyEgWNeunmhmR',
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
