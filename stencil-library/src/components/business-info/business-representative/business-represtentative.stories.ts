export default {
  title: 'Components/BusinessRepresentative',
  component: 'justifi-business-representative',
  parameters: {},
};

class BusinessRepresentativeArgs {
  'show-submit': boolean;

  constructor(args: any) {
    this['show-submit'] = args['show-submit'] || true;
  }
}

const Template = (args: BusinessRepresentativeArgs) => {
  return (`
    <div>
      <justifi-business-representative show-submit=${args['show-submit']} />
    </div>
  `);
};

export const Basic = Template.bind({});
