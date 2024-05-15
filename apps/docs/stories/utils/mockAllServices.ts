import { createServer } from 'miragejs';
import mockBusinessDetails from '../../../../mockData/mockBusinessDetails.json';
import mockGetCheckout from '../../../../mockData/mockGetCheckoutSuccess.json';
import mockPostCheckout from '../../../../mockData/mockPostCheckoutSuccess.json';
import mockGrossPaymentChart from '../../../../mockData/mockGrossVolumeReportSuccess.json';
import mockPayment from '../../../../mockData/mockPaymentDetailSuccess.json';
import mockPayments from '../../../../mockData/mockPaymentsSuccess.json';
import mockPayout from '../../../../mockData/mockPayoutDetailsSuccess.json';
import mockPayouts from '../../../../mockData/mockPayoutsSuccess.json';

export const API_PATHS = {
  BUSINESS_DETAILS: '/entities/business/:id',
  CHECKOUT: '/checkouts/:id',
  GROSS_VOLUME: '/account/:accountId/reports/gross_volume',
  PAYMENT_DETAILS: '/payments/:id',
  PAYMENTS_LIST: '/account/:id/payments',
  PAYOUT_DETAILS: '/payouts/:id',
  PAYOUTS_LIST: '/account/:id/payouts',
};

type MockAllServicesConfig = {
  bypass: string[];
};

export const mockAllServices = ({ bypass }: MockAllServicesConfig) => {
  createServer({
    routes() {
      this.urlPrefix = 'https://wc-proxy.justifi.ai/v1';

      // BusinessDetails
      this.get(API_PATHS.BUSINESS_DETAILS, () => mockBusinessDetails);

      this.patch(API_PATHS.BUSINESS_DETAILS, (_schema, request) => {
        const id = request.params.id;
        const newDetails = JSON.parse(request.requestBody);
        return { ...mockBusinessDetails, ...newDetails, id };
      });

      // GrossPaymentChart
      this.get(API_PATHS.GROSS_VOLUME, () => mockGrossPaymentChart);

      // PaymentDetails
      this.get(API_PATHS.PAYMENT_DETAILS, () => mockPayment);

      // PaymentsList
      this.get(API_PATHS.PAYMENTS_LIST, () => mockPayments);

      // PayoutDetails
      this.get(API_PATHS.PAYOUT_DETAILS, () => mockPayout);

      // PayoutsList
      this.get(API_PATHS.PAYOUTS_LIST, () => mockPayouts);

      // Checkout
      this.get(API_PATHS.CHECKOUT, () => mockGetCheckout);
      this.post(API_PATHS.CHECKOUT, () => mockPostCheckout);

      // Ensure all other requests not handled by Mirage are sent to the real network
      this.passthrough(...bypass);

      // To test an error response, you can use something like:
      // this.get('/somepath', new Response(500, {}, { error: 'An error message' }));
    },
  });
};
