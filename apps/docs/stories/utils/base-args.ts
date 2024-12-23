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
    'eyJraWQiOiJqdXN0aWZpLWUyNDgyMmU3ODE1MmEzZjRkMjU1IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguanVzdGlmaS5haS8iLCJhenAiOiJ3Y3RfNGtuUm5xSWd5bjFKZnI5cWJGQVlZSyIsInN1YiI6IndjdF80a25SbnFJZ3luMUpmcjlxYkZBWVlLQHNlc3Npb25zIiwiYXVkIjoiaHR0cHM6Ly9hcGkuanVzdGlmaS5haS92MSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsInBlcm1pc3Npb25zIjpbIndyaXRlOmJ1c2luZXNzOmJpel8zdm44NnAxWm9TTW04anl2Y1hlVndnIl0sImV4cCI6MTczNDk3OTQwNiwiaWF0IjoxNzM0OTc1ODA2LCJwbGF0Zm9ybV9hY2NvdW50X2lkIjoiYWNjXzdjVm5nN2VzQ3ZmSGV2V1FMU3dsbmsifQ.V_86y_npQNo0Do-GwwHrUVT_Oplho2zuMAADNg6GjCenB8Hc7vn_6cc0mBOfX5mHwGMBlSaN0MeJALkLGNJ0bUQc3kZEFV08yJVojuy0xadxiAf0ChueCugBYMB5jv8lbpfuibYfipEqoRYzd5lAdB5HepOwaVVqtFxOqKO3JJRCIvbDboEmX8t8sAOe2d7ro1p51jLunjac2BqvQLfs-02PJSpH2LwcArSNeIfw4u28DszFqESR_5ATSGM-1oPsU80NyfvyDd7QXmjIK2qnnkkgIgQ6OtP9FATDTwnUiNUbRakAzmJCdqFTBIpjIROCa_5LCS51FGtQpnKB9lG0AA',
  'business-id': 'biz_3vn86p1ZoSMm8jyvcXeVwg',
  'client-id': 'test_cb2ca143e4b801f9ba8d930c2f4bbb30',
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
