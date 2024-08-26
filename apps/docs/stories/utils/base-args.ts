type ArgNames =
  | 'auth-token'
  | 'account-id'
  | 'business-id'
  | 'client-id'
  | 'iframe-origin'
  | 'payment-id'
  | 'payout-id'
  | 'theme';
type ArgValues = { [key in ArgNames]?: any };
type ArgTypes = { [key in ArgNames]?: any };

const args: ArgValues = {
  'account-id': 'acc_5Et9iXrSSAZR2KSouQGAWi',
  'auth-token':
    'eyJraWQiOiJqdXN0aWZpLWUyNDgyMmU3ODE1MmEzZjRkMjU1IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguanVzdGlmaS5haS8iLCJhenAiOiJ3Y3RfNGdNV2lERjV4VjRDcFRYQTRna01IUSIsInN1YiI6IndjdF80Z01XaURGNXhWNENwVFhBNGdrTUhRQHNlc3Npb25zIiwiYXVkIjoiaHR0cHM6Ly9hcGkuanVzdGlmaS5haS92MSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsInBlcm1pc3Npb25zIjpbIndyaXRlOmJ1c2luZXNzOmJpel8zRXRDU0k5akVaQ1dFQndZdEpQNXhnIl0sImV4cCI6MTcyNDcxMDA5NywiaWF0IjoxNzI0NzA2NDk3LCJwbGF0Zm9ybV9hY2NvdW50X2lkIjoiYWNjXzV1NUR1czM5TWViMXFxU3N1NVU3cVMifQ.nbsFY50M9lKIdHdKuPoYiW5275L5hd2JnBaMq6nqQaWpVRqc6HWgfkl9oUZ6taOot77_j7KcBdYjjUkmFZbEMzmPehr526hPSZz6G2xIRkA_PcomISXkLpXC5iNMiVFo_qOmckGQ01tmMw3iIPJSgsjLZToRHMtEYipP5B4BdvcoSFhnBbRK8H01XmRT91XTvwo9SFmpVHSCvp3tb7nnUpLVoSqxG2z-TVHlNN67QctXEkROevIp7gasAHlS77PA5kVsEN0Mlvtb-yszocDrvgOZQbydDEFlY1hj9xXrX6abc2fCRLuP4MUxzBOJ4kvpIzatUBDIEMIfswX4w83nUQ',
  'business-id': 'biz_3EtCSI9jEZCWEBwYtJP5xg',
  'client-id': 'test_df97f04afebc3c018de30df3562d7cdd',
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
      'Select a theme to preview the component in. [See example](https://storybook.justifi.ai/?path=/docs/introduction--docs#styling-components-with-variables)',
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
