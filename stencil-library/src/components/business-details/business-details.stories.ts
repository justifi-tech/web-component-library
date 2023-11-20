export default {
  title: 'Components/BusinessDetails',
  component: 'justifi-business-details',
  parameters: {},
};

class BusinessDetailsArgs {
  'businessId': string;
  'authToken': string;

  constructor(args) {
    this['businessId'] = args['businessId'] || process.env.EXAMPLE_BUSINESS_ID;
    this['authToken'] = args['authToken'] || process.env.ENTITIES_AUTH_TOKEN
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
