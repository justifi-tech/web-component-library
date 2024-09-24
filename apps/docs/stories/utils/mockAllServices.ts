import { createServer } from 'miragejs';
import mockBusinessOwner from '../../../../mockData/mockBusinessOwner.json';
import mockBusinessDetails from '../../../../mockData/mockBusinessDetails.json';
import mockDocumentUpload from '../../../../mockData/mockDocumentRecordSuccess.json';
import mockBusinessTerms from '../../../../mockData/mockBusinessTermsSuccess.json';
import mockBusinessProvisioning from '../../../../mockData/mockBusinessProvisioningSuccess.json';
import mockGetCheckout from '../../../../mockData/mockGetCheckoutSuccess.json';
import mockPostCheckout from '../../../../mockData/mockPostCheckoutSuccess.json';
import mockGrossPaymentChart from '../../../../mockData/mockGrossVolumeReportSuccess.json';
import mockPayment from '../../../../mockData/mockPaymentDetailSuccess.json';
import mockPayments from '../../../../mockData/mockPaymentsSuccess.json';
import mockPayout from '../../../../mockData/mockPayoutDetailsSuccess.json';
import mockPayouts from '../../../../mockData/mockPayoutsSuccess.json';
import mockSeasonInterruptionInsurance from '../../../../mockData/mockSeasonInterruptionInsurance.json';

const handleMockGrossVolumeChartMock = () => {
  // Use mock data for GrossPaymentChart in Chromatic builds for consistent screenshots.
  const isChromaticBuild = __VITE_STORYBOOK_CHROMATIC_BUILD__ === 'true';
  if (isChromaticBuild) {
    return mockGrossPaymentChart;
  }

  // For regular Storybook, map all dates on the mock data to simulate dynamic data, especially to see dates from the past 30 days.
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
  EXISTING_BUSINESS_OWNER: '/entities/identity/:id',
  NEW_BUSINESS_OWNER: '/entities/identity',
  ANALYTICS: '/analytics',
  BUSINESS_DETAILS: '/entities/business/:id',
  BUSINESS_DOCUMENT_RECORD: '/entities/document',
  BUSINESS_DOCUMENT_UPLOAD: '/:account/:document',
  BUSINESS_TERMS_AND_CONDITIONS: '/entities/terms_and_conditions',
  BUSINESS_PROVISIONING: '/entities/provisioning',
  CHECKOUT: '/checkouts/:id',
  CHECKOUT_COMPLETE: '/checkouts/:id/complete',
  GROSS_VOLUME: '/account/:accountId/reports/gross_volume',
  PAYMENT_DETAILS: '/payments/:id',
  PAYMENTS_LIST: '/account/:id/payments',
  PAYOUT_DETAILS: '/payouts/:id',
  PAYOUTS_LIST: '/account/:id/payouts',
  INSURANCE_QUOTES: '/insurance/quotes',
};

type MockAllServicesConfig = {
  bypass?: string[];
};

export const mockAllServices = (config: MockAllServicesConfig = {}): void => {
  const bypass = config.bypass || [];
  createServer({
    routes() {
      // Primary URL prefix for API requests
      this.urlPrefix = __VITE_STORYBOOK_PROXY_API_ORIGIN__;
      this.namespace = '/v1';

      // BusinessOwner
      this.get(API_PATHS.EXISTING_BUSINESS_OWNER, () => mockBusinessOwner);

      this.patch(API_PATHS.EXISTING_BUSINESS_OWNER, (_schema, request) => {
        const id = request.params.id;
        const newOwner = JSON.parse(request.requestBody);
        return { ...mockBusinessOwner, ...newOwner, id };
      });

      this.post(API_PATHS.NEW_BUSINESS_OWNER, () => mockBusinessOwner);

      // BusinessDetails
      this.get(API_PATHS.BUSINESS_DETAILS, () => mockBusinessDetails);

      this.patch(API_PATHS.BUSINESS_DETAILS, (_schema, request) => {
        const id = request.params.id;
        const newDetails = JSON.parse(request.requestBody);
        return { ...mockBusinessDetails, ...newDetails, id };
      });

      this.post(API_PATHS.BUSINESS_DOCUMENT_RECORD, () => mockDocumentUpload);

      this.post(
        API_PATHS.BUSINESS_TERMS_AND_CONDITIONS,
        () => mockBusinessTerms
      );

      this.post(
        API_PATHS.BUSINESS_PROVISIONING,
        () => mockBusinessProvisioning
      );

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
      this.post(API_PATHS.CHECKOUT_COMPLETE, () => mockPostCheckout);

      // Analytics
      this.post(API_PATHS.ANALYTICS, () => null);

      // InsuranceQuotes
      this.post(
        API_PATHS.INSURANCE_QUOTES,
        () => mockSeasonInterruptionInsurance
      );

      // Secondary URL prefix for API requests
      this.namespace = ''; // Reset the namespace to avoid prefixing with the primary URL prefix
      this.urlPrefix =
        'https://entities-production-documents.s3.us-east-2.amazonaws.com';

      // BusinessDocumentUpload

      this.put(API_PATHS.BUSINESS_DOCUMENT_UPLOAD, () => null);

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
    // mockAllServices();
  }
};
