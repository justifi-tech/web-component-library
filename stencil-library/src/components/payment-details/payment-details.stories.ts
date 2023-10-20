export default {
  title: 'Components/PaymentDetails',
  component: 'justifi-payment-details',
  parameters: {},
};

class PaymentDetailsArgs {
  'auth-token': string;
  'payment-id': string;

  constructor(args) {
    this['auth-token'] = args['auth-token'] || 'eyJraWQiOiJqdXN0aWZpLWUyNDgyMmU3ODE1MmEzZjRkMjU1IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguanVzdGlmaS5haS8iLCJhenAiOiJvYXNfMkJMRHpaOHF6dDZndnNvQkxBZnFCbyIsInN1YiI6Im9hc18yQkxEelo4cXp0Nmd2c29CTEFmcUJvQHNlc3Npb25zIiwiYXVkIjoiaHR0cHM6Ly9hcGkuanVzdGlmaS5haS92MSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsInBlcm1pc3Npb25zIjpbeyJyb2xlIjoicmVhZDphY2NvdW50IiwicmVzb3VyY2VfaWQiOiJhY2NfMUdCS1Mycmc3bUxsMnIzRHM0TlBQWSJ9XSwiZXhwIjoxNzAwNDExOTYyLCJpYXQiOjE2OTc4MTk5NjIsInBsYXRmb3JtX2FjY291bnRfaWQiOiJhY2NfN2NWbmc3ZXNDdmZIZXZXUUxTd2xuayJ9.Xcafn_lBJAPoZf36CITUyENHuIQLgDCXTpkos2ZIufr8tqXN1jVb5_vmd4OYYuxQjfgAjPiQ5KF_-Zn14NsELihth-fAHagOeyFQ4hQNezULOy7oVhf7BpsUMPlMPcIM3beomTY--xqULxeSbTTo9Kt-Pu9sPIARb2wT7WpPlw1Xskm9jHjVRgM_QPxMxaqGa6YFXfivQpdWxCz4H9eD6eijUV2DIOvzkZ8UTRTul6AzIeIXFItynfjXeetrzBihBeirVOWMxlfIgOYNUeGo_IgnriHdyratxF1o3JZQb-mZS5AS-YYIYENm41I9sY6t7slAza3IhwZ400t6_lceww';
    this['payment-id'] = args['payment-id'] || 'py_76nDkjHlXOEFQue5o3tzMj';
  }
}

const Template = (args: PaymentDetailsArgs) => {
  return (`
    <justifi-payment-details
      data-testid="justifi-payment-details"
      auth-token="${args['auth-token']}"
      payment-id="${args['payment-id']}"
    />
  `);
};

export const Basic = Template.bind({});
Basic.args = new PaymentDetailsArgs({});

export const Styled = Template.bind({});
Styled.args = new PaymentDetailsArgs({});
Styled.decorators = [
  (Story) => `
    ${Story()}
    <style>
      justifi-payment-details::part(detail-head) {
        background-color: rgba(100, 200, 250, 0.2);
        border-left: 4px solid rgba(100, 200, 250, 1);
      }
      justifi-payment-details::part(detail-info-item-title),
      justifi-payment-details::part(detail-method-item-title) {
        border-radius: 3px;
        background-color: rgba(0, 0, 0, 0.8);
        text-align: center;
        padding: 0 10px;
        color: white !important;
      }
      justifi-payment-details::part(detail-metadata) {
        background-color: rgba(100,100,100,0.2)
      }
    </style>
  `
]
