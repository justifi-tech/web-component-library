import { createServer } from 'miragejs';
import mockBusinessOwner from '../../../../mockData/mockBusinessOwner.json';
import mockBusinessDetails from '../../../../mockData/mockBusinessDetails.json';
import mockDocumentUpload from '../../../../mockData/mockDocumentRecordSuccess.json';
import mockBusinessTerms from '../../../../mockData/mockBusinessTermsSuccess.json';
import mockBusinessProvisioning from '../../../../mockData/mockBusinessProvisioningSuccess.json';
import mockGetCheckout from '../../../../mockData/mockGetCheckoutSuccess.json';
import mockPostCheckout from '../../../../mockData/mockPostCheckoutSuccess.json';
import mockCheckoutsList from '../../../../mockData/mockGetCheckoutsListSuccess.json';
import mockGrossPaymentChart from '../../../../mockData/mockGrossVolumeReportSuccess.json';
import mockPayment from '../../../../mockData/mockPaymentDetailSuccess.json';
import mockPayments from '../../../../mockData/mockPaymentsSuccess.json';
import mockRefundResponse from '../../../../mockData/mockPostRefundSuccess.json';
import mockPostPaymentMethods from '../../../../mockData/mockPostPaymentMethodsSuccess.json';
import mockPayout from '../../../../mockData/mockPayoutDetailsSuccess.json';
import mockPayouts from '../../../../mockData/mockPayoutsSuccess.json';
import mockSeasonInterruptionInsurance from '../../../../mockData/mockSeasonInterruptionInsurance.json';
import mockTerminals from '../../../../mockData/mockTerminalsListSuccess.json';
import mockTerminalOrders from '../../../../mockData/mockTerminalOrdersListSuccess.json';
import mockSubAccounts from '../../../../mockData/mockSubAccountsListSuccess.json';
import mockDispute from '../../../../mockData/mockDisputeResponse.json';
import mockNPMVersion from '../../../../mockData/mockNPMVersion.json';
import mockOrderModels from '../../../../mockData/mockOrderModelsSuccess.json';
import mockPaymentTransactions from '../../../../mockData/mockPaymentTransactionsSuccess.json';
import mockPayoutTransactions from '../../../../mockData/mockPayoutTransactionsSuccess.json';

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
  CHECKOUTS_LIST: 'checkouts',
  GROSS_VOLUME: '/account/:accountId/reports/gross_volume',
  PAYMENT_DETAILS: '/payments/:id',
  PAYMENTS_LIST: '/account/:id/payments',
  PAYMENT_METHODS: '/payment_methods',
  REFUND: '/payments/:id/refunds',
  PAYOUT_DETAILS: '/payouts/:id',
  PAYOUTS_LIST: '/account/:id/payouts',
  INSURANCE_QUOTES: '/insurance/quotes',
  TERMINALS_LIST: 'terminals',
  TERMINAL_ORDERS_LIST: 'terminals/orders',
  SUB_ACCOUNTS_LIST: 'sub_accounts',
  PKG_VERSION: '/@justifi/webcomponents/latest',
  DISPUTE: '/disputes/:id',
  DISPUTE_RESPONSE: '/disputes/:id/response',
  ORDER_MODELS: '/terminals/order_models',
  ORDER_TERMINALS: '/terminals/orders',
  PAYMENT_TRANSACTIONS: '/payments/:id/payment_balance_transactions',
  PAYOUT_TRANSACTIONS: '/balance_transactions',
};

export const setUpMocks = () => {
  createServer({
    routes() {
      // Primary URL prefix for API requests
      this.urlPrefix = process.env.PROXY_API_ORIGIN || '';
      this.namespace = '/v1';

      // BusinessOwner
      this.get(API_PATHS.EXISTING_BUSINESS_OWNER, () => mockBusinessOwner);

      this.patch(API_PATHS.EXISTING_BUSINESS_OWNER, (_schema, request) => {
        const newRequestData = JSON.parse(request.requestBody);
        let mergedRequestData = {
          ...mockBusinessDetails.data.owners[0],
          ...newRequestData,
        };
        return {
          id: 2,
          type: 'identity',
          data: mergedRequestData,
          page_info: 'string',
        };
      });

      this.post(API_PATHS.NEW_BUSINESS_OWNER, () => mockBusinessOwner);

      // BusinessDetails
      this.get(API_PATHS.BUSINESS_DETAILS, () => mockBusinessDetails);

      this.patch(API_PATHS.BUSINESS_DETAILS, (_schema, request) => {
        const newRequestData = JSON.parse(request.requestBody);
        let mergedRequestData = {
          ...mockBusinessDetails.data,
          ...newRequestData,
        };
        return {
          id: 1,
          type: 'business',
          data: mergedRequestData,
          page_info: 'string',
        };
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

      // PaymentTransactions
      this.get(API_PATHS.PAYMENT_TRANSACTIONS, () => mockPaymentTransactions);

      // PayoutTransactions
      this.get(API_PATHS.PAYOUT_TRANSACTIONS, () => mockPayoutTransactions);

      // Post Refund
      this.post(API_PATHS.REFUND, () => mockRefundResponse);

      // PayoutDetails
      this.get(API_PATHS.PAYOUT_DETAILS, () => mockPayout);

      // PayoutsList
      this.get(API_PATHS.PAYOUTS_LIST, () => mockPayouts);

      // TerminalsList
      this.get(API_PATHS.TERMINALS_LIST, () => mockTerminals);

      // TerminalOrdersList
      this.get(API_PATHS.TERMINAL_ORDERS_LIST, () => mockTerminalOrders);

      // OrderTerminals
      this.get(API_PATHS.ORDER_MODELS, () => mockOrderModels);
      this.post(API_PATHS.ORDER_TERMINALS, (_schema, resquest) => {
        const response = JSON.parse(resquest.requestBody);

        return {
          id: 'tord_4DbrOOMTbsO2ZPG0MsvS3i',
          type: 'terminal_order',
          page_info: null,
          data: {
            id: 'tord_4DbrOOMTbsO2ZPG0MsvS3i',
            business_id: response.business_id,
            account_id: response.account_id,
            order_type: response.order_type,
            order_status: 'created',
            shipping_tracking_reference: null,
            company_name: 'Apricot Tavern 163',
            mcc: '7998',
            receiver_name: 'Jake Jake',
            contact_first_name: 'Jake',
            contact_last_name: 'Jake',
            contact_email: 'jakemerringer@gmail.com',
            contact_phone_number: '6124005000',
            line1: '730 Happiness Ln',
            line2: '100',
            city: 'Minneapolis',
            state: 'MN',
            postal_code: '55555',
            time_zone: 'US/Central',
            country: 'USA',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            // For each order item, generate `quantity` number of terminal objects,
            // each with a random `terminal_id` and `terminal_did`, while keeping the same `model_name`.
            // The result is a flattened array of all generated terminal objects, to mimic the API response.
            terminals: response.order_items
              .map((item: any) => {
                return Array.from({ length: item.quantity }, () => {
                  return {
                    terminal_id: `trm_${Math.random().toString(36).substring(2, 15)}`,
                    terminal_did: `${Math.floor(Math.random() * 100000000)}`,
                    model_name: item.model_name,
                  };
                });
              })
              .flat(),
          },
        };
      });

      // SubAccountsList
      this.get(API_PATHS.SUB_ACCOUNTS_LIST, () => mockSubAccounts);

      // Checkout
      this.get(API_PATHS.CHECKOUT, () => mockGetCheckout);
      this.post(API_PATHS.CHECKOUT_COMPLETE, () => mockPostCheckout);
      this.get(API_PATHS.CHECKOUTS_LIST, () => mockCheckoutsList);

      // Dispute
      this.get(API_PATHS.DISPUTE, () => mockDispute);
      this.post(API_PATHS.DISPUTE_RESPONSE, () => mockDispute);

      // SubAccounts
      this.get(API_PATHS.SUB_ACCOUNTS_LIST, () => mockSubAccounts);

      // InsuranceQuotes
      this.post(
        API_PATHS.INSURANCE_QUOTES,
        () => mockSeasonInterruptionInsurance
      );

      // URL prefix for direct API requests (for iframed application requests which don't use the proxy)
      // As of now this does not work because the request happens within the iframe and the iframe does not have access to the proxy
      this.namespace = '/v1/js'; // Reset the namespace to avoid prefixing with the primary URL prefix
      this.urlPrefix = 'https://api.justifi.ai';

      // PaymentMethods (TokenizePaymentMethod component)
      this.post(API_PATHS.PAYMENT_METHODS, () => mockPostPaymentMethods);

      // URL prefix for entity document uploads
      this.namespace = ''; // Reset the namespace to avoid prefixing with the primary URL prefix
      this.urlPrefix =
        'https://entities-production-documents.s3.us-east-2.amazonaws.com';

      // BusinessDocumentUpload

      this.put(API_PATHS.BUSINESS_DOCUMENT_UPLOAD, () => null);

      // URL Prefix for NPM Package Check
      this.namespace = ''; // Reset the namespace to avoid prefixing with the primary URL prefix
      this.urlPrefix = 'https://registry.npmjs.org';

      // PackageVersion
      this.get(API_PATHS.PKG_VERSION, () => mockNPMVersion);

      // To test an error response, you can use something like:
      // this.get('/somepath', new Response(500, {}, { error: 'An error message' }));
    },
  });
};
