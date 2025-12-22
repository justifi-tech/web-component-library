import { createServer } from 'miragejs';
import mockBusinessDetails from '../mocks/mockBusinessDetails.json';
import mockGetCheckout from '../mocks/mockGetCheckoutSuccess.json';
import mockPostCheckout from '../mocks/mockPostCheckoutSuccess.json';
import mockTerminals from '../mocks/mockTerminalsListSuccess.json';
import mockPostPaymentMethods from '../mocks/mockPostPaymentMethodsSuccess.json';
import mockTerminalOrders from '../mocks/mockTerminalOrdersListSuccess.json';
import mockOrderModels from '../mocks/mockTerminalModels.json';
import mockPayoutTransactions from '../mocks/mockPayoutTransactionsSuccess.json';
import mockPayoutDetails from '../mocks/mockPayoutDetailsSuccess.json';
import mockPayouts from '../mocks/mockPayoutsSuccess.json';
import mockPaymentTransactions from '../mocks/mockPaymentTransactionsSuccess.json';
import mockPaymentsList from '../mocks/mockPaymentsList.json';
import mockPaymentDetails from '../mocks/mockPaymentDetails.json';
import mockCheckoutsList from '../mocks/mockCheckoutsList.json';
import mockSubAccounts from '../mocks/mockSubAccounts.json';
import mockBusinessOwner from '../mocks/mockBusinessOwner.json';
import mockDocumentUpload from '../mocks/mockDocumentUpload.json';
import mockBusinessTerms from '../mocks/mockBusinessTerms.json';
import mockBusinessProvisioning from '../mocks/mockBusinessProvisioning.json';
import mockBankAccount from '../mocks/mockBankAccount.json';
import mockDispute from '../mocks/mockDisputeResponse.json';
import mockDisputePastDue from '../mocks/mockDisputePastDueResponse.json';
import mockNPMVersion from '../mocks/mockNPMVersion.json';
import mockRefundResponse from '../mocks/mockPostRefundSuccess.json';
import mockGrossPaymentChart from '../mocks/mockGrossVolumeReportSuccess.json';

const handleMockGrossVolumeChart = () => {
  // Map all dates on the mock data to simulate dynamic data, especially to see dates from the past 30 days.
  let dateBuffer = -1;
  const mappedDates = mockGrossPaymentChart.data.dates.map((item) => {
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
  BUSINESS_DETAILS: '/entities/business/:id',
  CHECKOUT: '/checkouts/:id',
  CHECKOUT_COMPLETE: '/checkouts/:id/complete',
  TERMINAL_ORDERS_LIST: 'terminals/orders',
  TERMINALS_LIST: 'terminals',
  PAYMENT_METHODS: '/payment_methods',
  ORDER_MODELS: '/terminals/order_models',
  ORDER_TERMINALS: '/terminals/orders',
  GROSS_VOLUME: '/account/:accountId/reports/gross_volume',
  PAYOUT_TRANSACTIONS: '/balance_transactions',
  PAYOUT_DETAILS: '/payouts/:id',
  PAYOUTS_LIST: '/account/:id/payouts',
  PAYMENT_TRANSACTIONS: '/payments/:id/payment_balance_transactions',
  PAYMENTS_LIST: '/account/:id/payments',
  PAYMENT_DETAILS: '/payments/:id',
  CHECKOUTS_LIST: 'checkouts',
  SUB_ACCOUNTS_LIST: 'sub_accounts',
  EXISTING_BUSINESS_OWNER: '/entities/identity/:id',
  NEW_BUSINESS_OWNER: '/entities/identity',
  BUSINESS_DETAILS: '/entities/business/:id',
  BUSINESS_DOCUMENT_RECORD: '/entities/document',
  BANK_ACCOUNTS: '/entities/bank_accounts',
  BUSINESS_TERMS_AND_CONDITIONS: '/entities/terms_and_conditions',
  BUSINESS_PROVISIONING: '/entities/provisioning',
  DISPUTE: '/disputes/:id',
  DISPUTE_RESPONSE: '/disputes/:id/response',
  REFUND: '/payments/:id/refunds',
  PKG_VERSION: '/@justifi/webcomponents/latest',
};

export const setUpMocks = () => {
  createServer({
    routes() {
      // Primary URL prefix for API requests
      this.urlPrefix = 'https://wc-proxy.justifi.ai';
      this.namespace = '/v1';

      // BusinessDetails
      this.get(API_PATHS.BUSINESS_DETAILS, () => mockBusinessDetails);

      // Checkout
      this.get(API_PATHS.CHECKOUT, () => mockGetCheckout);
      this.post(API_PATHS.CHECKOUT_COMPLETE, () => mockPostCheckout);
      // TerminalsList
      this.get(API_PATHS.TERMINALS_LIST, () => mockTerminals);

      // URL prefix for direct API requests (for iframed application requests which don't use the proxy)
      // As of now this does not work because the request happens within the iframe and the iframe does not have access to the proxy
      this.namespace = '/v1/js'; // Reset the namespace to avoid prefixing with the primary URL prefix
      this.urlPrefix = 'https://api.justifi.ai';

      // PaymentMethods (TokenizePaymentMethod component)
      this.post(API_PATHS.PAYMENT_METHODS, () => mockPostPaymentMethods);

      // Reset namespace and URL prefix for other endpoints
      this.namespace = '/v1';
      this.urlPrefix = 'https://wc-proxy.justifi.ai';
      // TerminalOrdersList
      this.get(API_PATHS.TERMINAL_ORDERS_LIST, () => mockTerminalOrders);
      // OrderTerminals
      this.get(API_PATHS.ORDER_MODELS, () => mockOrderModels);
      this.post(API_PATHS.ORDER_TERMINALS, (_schema, request) => {
        const response = JSON.parse(request.requestBody);

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
            terminals: response.order_items
              .map((item) => {
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

      // GrossPaymentChart
      this.get(API_PATHS.GROSS_VOLUME, handleMockGrossVolumeChart);
      // PayoutTransactions
      this.get(API_PATHS.PAYOUT_TRANSACTIONS, () => mockPayoutTransactions);
      // PayoutDetails
      this.get(API_PATHS.PAYOUT_DETAILS, () => mockPayoutDetails);
      // PayoutsList
      this.get(API_PATHS.PAYOUTS_LIST, () => mockPayouts);
      // PaymentTransactions
      this.get(API_PATHS.PAYMENT_TRANSACTIONS, () => mockPaymentTransactions);
      // PaymentsList
      this.get(API_PATHS.PAYMENTS_LIST, () => mockPaymentsList);
      // PaymentDetails
      this.get(API_PATHS.PAYMENT_DETAILS, () => mockPaymentDetails);
      // CheckoutsList
      this.get(API_PATHS.CHECKOUTS_LIST, () => mockCheckoutsList);

      // SubAccountsList
      this.get(API_PATHS.SUB_ACCOUNTS_LIST, () => mockSubAccounts);
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

      this.post(API_PATHS.BANK_ACCOUNTS, () => mockBankAccount);

      this.post(
        API_PATHS.BUSINESS_TERMS_AND_CONDITIONS,
        () => mockBusinessTerms
      );

      this.post(
        API_PATHS.BUSINESS_PROVISIONING,
        () => mockBusinessProvisioning
      );

      // Dispute
      this.get(API_PATHS.DISPUTE, (_schema, request) => {
        const id = request.params.id;
        return id.includes('pastdue') ? mockDisputePastDue : mockDispute;
      });
      this.post(API_PATHS.DISPUTE_RESPONSE, (_schema, request) => {
        const id = request.params.id;
        return id.includes('pastdue') ? mockDisputePastDue : mockDispute;
      });
      // Post Refund
      this.post(API_PATHS.REFUND, () => mockRefundResponse);

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
