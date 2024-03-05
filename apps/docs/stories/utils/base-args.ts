type ArgNames = 'auth-token' | 'account-id' | 'business-id' | 'client-id' | 'iframe-origin' | 'payment-id' | 'payout-id';
type ArgValues = { [key in ArgNames]?: string; };
type ArgTypes = { [key in ArgNames]?: any; }

const args: ArgValues = {
  'account-id': 'acc_5Et9iXrSSAZR2KSouQGAWi',
  'auth-token':
    'eyJraWQiOiJqdXN0aWZpLWUyNDgyMmU3ODE1MmEzZjRkMjU1IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguanVzdGlmaS5haS8iLCJhenAiOiJ3Y3RfMUdCY2Vudms5cWJJMWl5VzhwOXk0RiIsInN1YiI6IndjdF8xR0JjZW52azlxYkkxaXlXOHA5eTRGQHNlc3Npb25zIiwiYXVkIjoiaHR0cHM6Ly9hcGkuanVzdGlmaS5haS92MSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsInBlcm1pc3Npb25zIjpbIndyaXRlOmJ1c2luZXNzOmJpel8zbkRURVdadkxLTEo5eXBpdHhKNDNRIl0sImV4cCI6MTcwOTY1MjY2MSwiaWF0IjoxNzA5NjQ5MDYxLCJwbGF0Zm9ybV9hY2NvdW50X2lkIjoiYWNjXzV1NUR1czM5TWViMXFxU3N1NVU3cVMifQ.ZgAWALKrb913CRCujsVVTGFbGHB9bh_OvGr8zrh5MjtPIhRV0_NJorLzoBoHELtnW8w8L9IK6SUmLgWlnNsmC--vatNGJd5PW-mCkurKr0zVq1k2iIkpuN25SYE4pM-QI9g6pDm6_9qx_vzxq0HFEuV9cusA7JSy1VKhhOQg0UUwFDWybYbu-rUEUgWWm7rUUVRgMy-DoHI2Q8SUP5oMj0flpjlwPqNCGPAO0zNEtUvrGsm58pfHUSs-gaZv-HjBhkq_U8QF0ImBIVPj0BUSK24wK7dqpsKXFGgft_P5S5Zunc7OJOEJTQVh0PQJqHuzzrf5VKRPiDzL3Zi3l1F98g',
  'business-id': 'biz_3nDTEWZvLKLJ9ypitxJ43Q',
  'client-id': 'test_df97f04afebc3c018de30df3562d7cdd',
  'payment-id': 'py_1NNeEnf4FbelxDCQN2RHcE',
  'payout-id': 'po_17745yESnHyEgWNeunmhmR',
};

const argTypes: ArgTypes = {
  'auth-token': {
    type: 'string',
    description: 'Auth token `string`',
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