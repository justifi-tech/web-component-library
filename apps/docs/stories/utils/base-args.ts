type ArgNames = 'auth-token' | 'account-id' | 'business-id' | 'client-id' | 'iframe-origin' | 'payment-id' | 'payout-id';
type ArgValues = { [key in ArgNames]?: string; };
type ArgTypes = { [key in ArgNames]?: any; }

const args: ArgValues = {
  'account-id': 'acc_5Et9iXrSSAZR2KSouQGAWi',
  'auth-token': 'eyJraWQiOiJqdXN0aWZpLWUyNDgyMmU3ODE1MmEzZjRkMjU1IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguanVzdGlmaS5haS8iLCJhenAiOiJ3Y3RfM0owdGNrTWtxRUFnRno2MnpualVBWCIsInN1YiI6IndjdF8zSjB0Y2tNa3FFQWdGejYyem5qVUFYQHNlc3Npb25zIiwiYXVkIjoiaHR0cHM6Ly9hcGkuanVzdGlmaS5haS92MSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsInBlcm1pc3Npb25zIjpbIndyaXRlOmJ1c2luZXNzOmJpel81RURNWGtQYWl6aGtVdVBsaFlFTWJoIl0sImV4cCI6MTcxNzYyODAxOSwiaWF0IjoxNzE3NjI0NDE5LCJwbGF0Zm9ybV9hY2NvdW50X2lkIjoiYWNjXzV1NUR1czM5TWViMXFxU3N1NVU3cVMifQ.dymOwN00ALpXcSjhpEolpwU_pPiNzjH1MW4PcrSMJEHiJ9f491RuSjwkDofH9I3ROsqzXYJRaH0kJ74WuC4Fl-QepvWCzS3dz13r_y5JsymqYM0iNMHgt9NUTWMxGVYC3G0JZjwsMiyhyUabOAh-r3unvAN_ZOfeFFR4Fp41c6C9VGzLLsWUKrvYWB19Xy7GjFUxblnz3kWnk2N8BYf_WqpaYLg_qLUK6sRpGBwf9ql5bABY_zj231sfSLDOpLiv3ywPzt3jIY5_BxMtkt9SEGn87_TEujWPErBVCK3g3tY9PIG5y7Z2K9wj0X9rK61WKV0R8UZhdbPQlBnBM-ffLQ',
  'business-id': 'biz_5EDMXkPaizhkUuPlhYEMbh',
  'client-id': 'test_df97f04afebc3c018de30df3562d7cdd',
  'payment-id': 'py_1NNeEnf4FbelxDCQN2RHcE',
  'payout-id': 'po_17745yESnHyEgWNeunmhmR',
};

const argTypes: ArgTypes = {
  'auth-token': {
    type: 'string',
    description: 'Auth token `string`. See Authorization below',
    control: {
      type: 'text',
    },
    table: {
      category: 'props'
    }
  },
  'account-id': {
    type: 'string',
    description: 'Account ID `string`',
    control: {
      type: 'text',
    },
    table: {
      category: 'props'
    }
  },
  'business-id': {
    type: 'string',
    description: 'Business ID `string`, the id of the business you create via API',
    control: {
      type: 'text',
    },
    table: {
      category: 'props'
    }
  },
  'client-id': {
    type: 'string',
    description: 'Client ID `string`',
    control: {
      type: 'text',
    },
    table: {
      category: 'props'
    }
  },
  'iframe-origin': {
    table: {
      disable: true
    },
  },
  'payment-id': {
    type: 'string',
    description: 'Payment ID `string`',
    control: {
      type: 'text',
    },
    table: {
      category: 'props'
    }
  },
  'payout-id': {
    type: 'string',
    description: 'Payout ID `string`',
    control: {
      type: 'text',
    },
    table: {
      category: 'props'
    }
  },
}

export class StoryBaseArgs {
  args: ArgValues = {};
  argTypes: ArgTypes = {};

  constructor(argKeys: ArgNames[]) {
    argKeys.forEach(key => {
      this.args[key] = args[key];
      this.argTypes[key] = argTypes[key];
    });
  }
}

export const paymentMethodFormComponentMethods = {
  'resize': {
    description: 'Triggers the iframe to compute it\'s height based on it\'s content and resize. This method is deprecated and will be removed in a future release in favor of better automatic resizing',
    table: {
      category: 'methods',
    }
  },
  'validate': {
    description: 'Asynchronous. Triggers validation on the form and shows errors if any, and returns a promise that resolves with `{ isValid: <boolean> }`',
    table: {
      category: 'methods'
    }
  },
  'tokenize': {
    description: 'Asynchronous. Triggers validation, then tokenization of payment method information if it passes client side validation. Returns a promise that resolves with the [tokenization request response body](https://developer.justifi.ai/tag/Payments#operation/CreatePayment). `tokenize(CLIENT_ID, PAYMENT_METHOD_METADATA, ACCOUNT_ID)`',
    table: {
      category: 'methods'
    }
  }
};
