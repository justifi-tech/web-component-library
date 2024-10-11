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
  'account-id': 'acc_323sM3WDAUnHH0fJD7re9h',
  'auth-token':
    'eyJraWQiOiJqdXN0aWZpLTQxNTczZmIyNjU0MDVmNDY0Y2UyIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguanVzdGlmaS1zdGFnaW5nLmNvbS8iLCJhenAiOiJ3Y3RfMTBublVsOHNUSzM5QnI4NHRHdk9nSCIsInN1YiI6IndjdF8xMG5uVWw4c1RLMzlCcjg0dEd2T2dIQHNlc3Npb25zIiwiYXVkIjoiaHR0cHM6Ly9hcGkuanVzdGlmaS5haS92MSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsInBlcm1pc3Npb25zIjpbInJlYWQ6YWNjb3VudDphY2NfMzIzc00zV0RBVW5ISDBmSkQ3cmU5aCJdLCJleHAiOjE3Mjg1OTkxOTEsImlhdCI6MTcyODU5NTU5MSwicGxhdGZvcm1fYWNjb3VudF9pZCI6ImFjY183NWo1eUd4UVVmNjlCOXZUMmhEVW45In0.XAky5Dw_L5dewp7Kl9iNkLUKShffOT5by-a8L0oZ_sA7jbKU7397hLmnlyXATdy8JZKonEXDfXkI_LGqB3HZZMNO3k9E7Zug0WbORSXyVHzEI3FGgWbEvKNBa-O0KT945wYR5WPCOSDrO2XbfCa3lc2HjeRLm1r6mi_nj2SNkuk32Zn0jofWhsyIdX7rhOlaJMRYn4vV6dgXi40dzYOzuzC4ynjAbAmaW_iikdH7vgRP-hGskkXbeXdRLRGTQAWu8NARlvNsmb0nFpcCOiYwWBluBIcBaPJZIG7CzAD_wLsVd3uCIQ2DRjpyRT8wK8kofAIGRu2U3vG-jxJKP43hCA',
  'business-id': 'biz_3bh69bq1rk3dmXNoAKVonu',
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
