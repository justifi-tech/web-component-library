import { createServer } from 'miragejs';
import mockBusinessOwner from '../../../../mockData/mockBusinessOwner.json';
import mockBusinessDetails from '../../../../mockData/mockBusinessDetails.json';
import mockGetCheckout from '../../../../mockData/mockGetCheckoutSuccess.json';
import mockPostCheckout from '../../../../mockData/mockPostCheckoutSuccess.json';
import mockGrossPaymentChart from '../../../../mockData/mockGrossVolumeReportSuccess.json';
import mockPayment from '../../../../mockData/mockPaymentDetailSuccess.json';
import mockPayments from '../../../../mockData/mockPaymentsSuccess.json';
import mockPayout from '../../../../mockData/mockPayoutDetailsSuccess.json';
import mockPayouts from '../../../../mockData/mockPayoutsSuccess.json';

const handleMockGrossVolumeChartMock = () => {
  const isChromaticBuild = __VITE_STORYBOOK_CHROMATIC_BUILD__ === 'true';
  if (isChromaticBuild) {
    return mockGrossPaymentChart;
  }

  let dateBuffer = -1;

  const mappedDates = mockGrossPaymentChart.data.dates.map((item: any) => {
    return {
      ...item,
      // for each item in the array, assign a new date one day behind the current date
      date: new Date(new Date().setDate(new Date().getDate() - ++dateBuffer))
        .toISOString()
        .split('T')[0],
    };
  });

  mockGrossPaymentChart.data.dates = mappedDates;
  return mockGrossPaymentChart;
};

export const API_PATHS = {
  BUSINESS_OWNER: '/entities/identity/:id',
  BUSINESS_DETAILS: '/entities/business/:id',
  CHECKOUT: '/checkouts/:id',
  GROSS_VOLUME: '/account/:accountId/reports/gross_volume',
  PAYMENT_DETAILS: '/payments/:id',
  PAYMENTS_LIST: '/account/:id/payments',
  PAYOUT_DETAILS: '/payouts/:id',
  PAYOUTS_LIST: '/account/:id/payouts',
};

type MockAllServicesConfig = {
  bypass?: string[];
};

export const mockAllServices = (config: MockAllServicesConfig = {}): void => {
  const bypass = config.bypass || [];
  createServer({
    routes() {
      this.urlPrefix = 'https://wc-proxy.justifi.ai/v1';

      // BusinessOwner
      this.get(API_PATHS.BUSINESS_OWNER, () => mockBusinessOwner);

      this.patch(API_PATHS.BUSINESS_OWNER, (_schema, request) => {
        const id = request.params.id;
        const newOwner = JSON.parse(request.requestBody);
        return { ...mockBusinessOwner, ...newOwner, id };
      });

      // BusinessDetails
      this.get(API_PATHS.BUSINESS_DETAILS, () => mockBusinessDetails);

      this.patch(API_PATHS.BUSINESS_DETAILS, (_schema, request) => {
        const id = request.params.id;
        const newDetails = JSON.parse(request.requestBody);
        return { ...mockBusinessDetails, ...newDetails, id };
      });

      // GrossPaymentChart
      this.get(API_PATHS.GROSS_VOLUME, handleMockGrossVolumeChartMock);

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

export const setUpMocks = () => {
  const isMocksEnabled = __VITE_STORYBOOK_MOCKS_ENABLED__ === 'true';

  if (isMocksEnabled) {
    // Use mock data for GrossPaymentChart only in Chromatic builds for consistent screenshots.
    // For regular Storybook, use proxyApi to view dynamic data, especially to see dates from the past 30 days.
    mockAllServices();
  }
};
