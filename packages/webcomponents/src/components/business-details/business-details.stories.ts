import { config } from '../../../config';

export default {
  title: 'Components/BusinessDetails',
  component: 'justifi-business-details',
  parameters: {},
};

class BusinessDetailsArgs {
  'businessId': string;
  'authToken': string;

  constructor(args) {
    this['businessId'] = args['businessId'] || config.exampleBusinessId;
    this['authToken'] = args['authToken'] || config.proxyAuthToken;
  }
};

const Template = (args: BusinessDetailsArgs) => {
  return `
    <justifi-business-details
      business-id="${args['businessId']}"
      auth-token="${args['authToken']}"
    />
  `;
};

export const Basic = Template.bind({});
Basic.args = new BusinessDetailsArgs({});
