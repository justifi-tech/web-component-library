import { createServer } from 'miragejs';
import mockBusinessDetails from '../mocks/mockBusinessDetails.json';
import mockPaymentTransactions from '../mocks/mockPaymentTransactionsSuccess.json';
import mockNPMVersion from '../mocks/mockNPMVersion.json';

export const API_PATHS = {
  BUSINESS_DETAILS: '/entities/business/:id',
  PAYMENT_TRANSACTIONS: '/payments/:id/payment_balance_transactions',
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

      // PaymentTransactions
      this.get(API_PATHS.PAYMENT_TRANSACTIONS, () => mockPaymentTransactions);

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
