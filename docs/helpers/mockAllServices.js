import { createServer } from 'miragejs';
import mockBusinessDetails from '../mocks/mockBusinessDetails.json';
import mockPayoutTransactions from '../mocks/mockPayoutTransactionsSuccess.json';
import mockNPMVersion from '../mocks/mockNPMVersion.json';

export const API_PATHS = {
  BUSINESS_DETAILS: '/entities/business/:id',
  PAYOUT_TRANSACTIONS: '/balance_transactions',
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

      // PayoutTransactions
      this.get(API_PATHS.PAYOUT_TRANSACTIONS, () => mockPayoutTransactions);

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
