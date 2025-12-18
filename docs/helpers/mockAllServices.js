import { createServer } from 'miragejs';
import mockBusinessDetails from '../mocks/mockBusinessDetails.json';
import mockCheckoutsList from '../mocks/mockCheckoutsList.json';
import mockSubAccounts from '../mocks/mockSubAccounts.json';
import mockNPMVersion from '../mocks/mockNPMVersion.json';

export const API_PATHS = {
  BUSINESS_DETAILS: '/entities/business/:id',
  CHECKOUTS_LIST: 'checkouts',
  SUB_ACCOUNTS_LIST: 'sub_accounts',
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

      // CheckoutsList
      this.get(API_PATHS.CHECKOUTS_LIST, () => mockCheckoutsList);

      // SubAccountsList
      this.get(API_PATHS.SUB_ACCOUNTS_LIST, () => mockSubAccounts);

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
