import { createServer } from 'miragejs';
import mockBusinessDetails from '../mocks/mockBusinessDetails.json';
import mockNPMVersion from '../mocks/mockNPMVersion.json';
import mockGetCheckout from '../mocks/mockGetCheckoutSuccess.json';
import mockPostCheckout from '../mocks/mockPostCheckoutSuccess.json';

export const API_PATHS = {
  BUSINESS_DETAILS: '/entities/business/:id',
  PKG_VERSION: '/@justifi/webcomponents/latest',
  CHECKOUT: '/checkouts/:id',
  CHECKOUT_COMPLETE: '/checkouts/:id/complete',
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
