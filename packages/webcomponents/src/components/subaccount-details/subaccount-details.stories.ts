import { config } from '../../../config';

export default {
  title: 'dev/Components/SubaccountDetails',
  component: 'justifi-subaccount-details',
  parameters: {},
};

class SubaccountDetailsArgs {
  'auth-token': string;
  'account-id': string;
  'subaccount-id': string;

  constructor(args) {
    this['auth-token'] = args['auth-token'] || config.privateAuthToken;
    this['account-id'] = args['account-id'] || '';
    this['subaccount-id'] = args['subaccount-id'] || 'subaccount-id';
  }
}

const Template = (args: SubaccountDetailsArgs) => {
  return `
    <justifi-subaccount-details
      data-testid="justifi-subaccounts-details"
      auth-token="${args['auth-token']}"
      account-id="${args['account-id']}"
      subaccount-id="${args['subaccount-id']}"
    />
  `;
};

export const Example = Template.bind({});
Example.args = new SubaccountDetailsArgs({});
