import { config } from "../../../config";

export default {
  title: 'dev/Components/GrossPaymentChart',
  component: 'justifi-gross-payment-chart',
  parameters: {}
};

class GrossChartArgs {
  'auth-token': string;
  'account-id': string;

  constructor(args) {
    this['auth-token'] = args['auth-token'] || config.proxyAuthToken;
    this['account-id'] = args['account-id'] || config.exampleAccountId;
  }
}

const Template = (args: GrossChartArgs) => {
  return (`
    <justifi-gross-payment-chart 
      auth-token="${args['auth-token']}"
      account-id="${args['account-id']}"
    />
  `)
}

export const Basic = Template.bind({});
Basic.args = new GrossChartArgs({});
