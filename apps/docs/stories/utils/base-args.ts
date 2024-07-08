type ArgNames =
  | 'auth-token'
  | 'account-id'
  | 'business-id'
  | 'client-id'
  | 'iframe-origin'
  | 'payment-id'
  | 'payout-id'
  | 'custom-styled';
type ArgValues = { [key in ArgNames]?: any };
type ArgTypes = { [key in ArgNames]?: any };

const args: ArgValues = {
  'account-id': 'acc_5Et9iXrSSAZR2KSouQGAWi',
  'auth-token':
    'eyJraWQiOiJqdXN0aWZpLWUyNDgyMmU3ODE1MmEzZjRkMjU1IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguanVzdGlmaS5haS8iLCJhenAiOiJ3Y3RfNXpYcUpqRm1JZzJTa2ZpOGlVZUMwTyIsInN1YiI6IndjdF81elhxSmpGbUlnMlNrZmk4aVVlQzBPQHNlc3Npb25zIiwiYXVkIjoiaHR0cHM6Ly9hcGkuanVzdGlmaS5haS92MSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsInBlcm1pc3Npb25zIjpbInJlYWQ6YWNjb3VudDphY2NfNUV0OWlYclNTQVpSMktTb3VRR0FXaSIsInJlYWQ6YnVzaW5lc3M6Yml6XzNiaDY5YnExcmszZG1YTm9BS1ZvbnUiXSwiZXhwIjoxNzI1OTgyNDc0LCJpYXQiOjE3MTgyMDY0NzQsInBsYXRmb3JtX2FjY291bnRfaWQiOiJhY2NfM3JlTmI0YU5ZeTJpV0RaUVZjem14NCJ9.EVnfeXD9-OYAm45GhJR9pTTA3o3Uf3iU2RGS4Yf-SrTeLaswZE6KmyuVIw_K2q-cqh4Cwe85QCMUh5HXKefLNjnJOGax35x_br1c3Tdl5kErqV1xMkXvdFdC_jdhaLzk9LbEAtQufPey5h-Wg5c8oosA_m7OK_OhqcJsABigzA1Ma0w585LH0Y1fhl_qHYFpg2HSMHLG1kGuXMOTMgJH4z9sA-OwDpvSKX8_yF_NlGR-SdymbM0vS7BCMi4uwlrSqAdafWYTFRIjNaPc9ncKLuageFm1k3xFk9gt3fzjzLpk7or7QOaRMHTrQTXT3l-g-g6PZc6dMFKVhWWkaK4S5w',
  'business-id': 'biz_3bh69bq1rk3dmXNoAKVonu',
  'client-id': 'test_df97f04afebc3c018de30df3562d7cdd',
  'payment-id': 'py_1NNeEnf4FbelxDCQN2RHcE',
  'payout-id': 'po_17745yESnHyEgWNeunmhmR',
  'custom-styled': false,
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
  'custom-styled': {
    type: 'boolean',
    description: 'Use custom styles `boolean`',
    control: {
      type: 'boolean',
    },
    table: {
      category: 'styles',
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
