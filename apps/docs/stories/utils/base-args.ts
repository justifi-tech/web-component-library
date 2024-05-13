type ArgNames = 'auth-token' | 'account-id' | 'business-id' | 'client-id' | 'iframe-origin' | 'payment-id' | 'payout-id';
type ArgValues = { [key in ArgNames]?: string; };
type ArgTypes = { [key in ArgNames]?: any; }

const args: ArgValues = {
  'account-id': 'acc_5Et9iXrSSAZR2KSouQGAWi',
  'auth-token': 'eyJraWQiOiJqdXN0aWZpLWUyNDgyMmU3ODE1MmEzZjRkMjU1IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguanVzdGlmaS5haS8iLCJhenAiOiJ3Y3RfMU0xd0UxSWtwd3QyMzhaU3FuR1BOciIsInN1YiI6IndjdF8xTTF3RTFJa3B3dDIzOFpTcW5HUE5yQHNlc3Npb25zIiwiYXVkIjoiaHR0cHM6Ly9hcGkuanVzdGlmaS5haS92MSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsInBlcm1pc3Npb25zIjpbInJlYWQ6YWNjb3VudDphY2NfNUV0OWlYclNTQVpSMktTb3VRR0FXaSIsInJlYWQ6YnVzaW5lc3M6Yml6XzNiaDY5YnExcmszZG1YTm9BS1ZvbnUiXSwiZXhwIjoxNzE5NDM0MDY1LCJpYXQiOjE3MTE2NTgwNjUsInBsYXRmb3JtX2FjY291bnRfaWQiOiJhY2NfM3JlTmI0YU5ZeTJpV0RaUVZjem14NCJ9.JnhpZiNA96YFAIJzNlxZlVZzrX-W1gOeWf-Xyb58PulqtxjCEfRoP2zfOR0GFobnQijwa1PpuMnQXif3H4QQm01vaWShliMrEOEnsE5yB4IrXz0z2zrUrhL79vDbVdub8I7v6bDkLcxfp5afslnAiLeMzB65YoxHFTeLN_WjjJfTHO1UTSrOG40RKHuuPNawqVlfz-rJ-mmLC-6usaZfb-lKvAPDg_ZBa0K6-h65qjhbBbl35gbTbFUJTr8p8acRpqtkAp-iLGTR7JhU6edn9oers4v_nwL8IXR-QDiamQxr-wwu0XUoZoAgslGoOIRKMXq3rvD6TGX9AEMNjHem7w',
  'business-id': 'biz_3bh69bq1rk3dmXNoAKVonu',
  'client-id': 'test_df97f04afebc3c018de30df3562d7cdd',
  'payment-id': 'py_1NNeEnf4FbelxDCQN2RHcE',
  'payout-id': 'po_17745yESnHyEgWNeunmhmR',
};

const argTypes: ArgTypes = {
  'auth-token': {
    type: 'string',
    description: 'Auth token `string`, the web component token you create via API. See Authorization below',
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
    description: 'Business ID `string`',
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