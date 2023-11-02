export default {
  title: 'Components/BusinessDetails',
  component: 'justifi-business-details',
  parameters: {},
};

type Args = {
  businessId: string;
  authToken: string;
};

const Template = (args: Args) => {
  return `
    <justifi-business-details
      business-id="${args.businessId || process.env.EXAMPLE_BUSINESS_ID}"
      auth-token="${args.authToken || process.env.ENTITIES_AUTH_TOKEN}"
    />
  `;
};

export const Basic = Template;
