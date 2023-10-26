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
      business-id="${args.businessId || ''}"
      auth-token="${args.authToken || ''}"
    />
  `;
};

export const Basic = Template;
