export default {
  title: 'Components/SubaccountDetails',
  component: 'justifi-subaccount-details',
  parameters: {}
};

class SubaccountDetailsArgs {
  'auth-token': string;
  'account-id': string;
  'subaccount-id': string;

  constructor(args) {
    this['auth-token'] = args['auth-token'] || process.env.PRIVATE_AUTH_TOKEN;
    this['account-id'] = args['account-id'] || process.env.EXAMPLE_PLATFORM_ACCOUNT_ID;
    this['subaccount-id'] = args['subaccount-id'] || process.env.EXAMPLE_SUBACCOUNT_ID;
  }
}

const Template = (args: SubaccountDetailsArgs) => {
  return (`
    <justifi-subaccount-details
      data-testid="justifi-subaccounts-details"
      auth-token="${args['auth-token']}"
      account-id="${args['account-id']}"
      subaccount-id="${args['subaccount-id']}"
    />
  `);
};

export const Basic = Template.bind({});
Basic.args = new SubaccountDetailsArgs({});
