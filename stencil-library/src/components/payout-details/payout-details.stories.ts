export default {
  title: 'dev/Components/PayoutDetails',
  component: 'justifi-payout-details',
  parameters: {}
};

class PayoutDetailsArgs {
  'auth-token': string;
  'payout-id': string;

  constructor(args) {
    this['auth-token'] = args['auth-token'] || '';
    this['payout-id'] = args['payout-id'] || '';
  }
}

const Template = (args: PayoutDetailsArgs) => {
  return (`
    <justifi-payout-details
      data-testid="justifi-payout-details"
      auth-token="${args['auth-token']}"
      payout-id="${args['payout-id']}"
    />
  `);
};

export const Basic = Template.bind({});
Basic.args = new PayoutDetailsArgs({});

export const Styled = Template.bind({});
Styled.args = new PayoutDetailsArgs({});
Styled.decorators = [
  (Story) => `
    ${Story()}
    <style>
      justifi-payout-details::part(detail-head) {
        background-color: rgba(100, 200, 250, 0.2);
        border-left: 4px solid rgba(100, 200, 250, 1);
      }
      justifi-payout-details::part(detail-info-item-title),
      justifi-payout-details::part(detail-method-item-title) {
        border-radius: 3px;
        background-color: rgba(0, 0, 0, 0.8);
        text-align: center;
        padding: 0 10px;
        color: white !important;
      }
      justifi-payout-details::part(detail-metadata) {
        background-color: rgba(100,100,100,0.2)
      }
    </style>
  `
]
