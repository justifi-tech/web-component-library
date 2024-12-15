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
  'account-id': 'acc_Tn4GLwvfQN30kaLuhYn1n',
  'auth-token':
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imx1ZWlDa2Qtdjd2M3hYVHduclNaUiJ9.eyJodHRwczovL2FwaS5qdXN0aWZpLmFpL3YxL3JvbGVzIjpbImFkbWluOnN1cGVyIl0sImlzcyI6Imh0dHBzOi8vYXV0aC5qdXN0aWZpLmFpLyIsInN1YiI6ImF1dGgwfDY3MzM4NDkzMThhMjZhMDFhYmU0OTE3ZiIsImF1ZCI6WyJodHRwczovL2FwaS5qdXN0aWZpLmFpL3YxIiwiaHR0cHM6Ly9qdXN0aWZpLnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE3MzQwMDAzMzUsImV4cCI6MTczNDA4NjczNSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImF6cCI6IlpCZXE5TUl1VGZ2eEZaTndvSHlxbEdwNFc0YVlKVW90IiwicGVybWlzc2lvbnMiOltdfQ.IgDruoULMmH4M4ibtWXAGsYPAb_qNOeSDSwDmrHsXVlDmCEs81-BvKwRio4agw4aSOLtgUfhFNeBpEyrf3Qqb1oL5w_txCBn1hygAKvdPjmoaXQ5zu7FYczYXGo0fJVAD_cDwGkzx4Zq1t6uZYp5Gi1BKxpzsPCQmA-OcwnoOzP1EQF_AuyVZTto9a3I1-neIp3IZAfk97eW5QuPm7ef_eJXuRrW-MhpWaywdzt6eS3zGRINAa_aLmLErZmnzyhT5Cjnk9RyoQnmLP3jn-MaroWXPn0SCN7nBnTMkMOW7TQX3mSlpcUW94JKAoomzfmT1jap9RG3F8pHlV8ADhYjkA',
  'business-id': 'biz_3vn86p1ZoSMm8jyvcXeVwg',
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
