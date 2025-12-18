import { createServer } from 'miragejs';
import mockBusinessDetails from '../mocks/mockBusinessDetails.json';
import mockTerminals from '../mocks/mockTerminalsListSuccess.json';
import mockNPMVersion from '../mocks/mockNPMVersion.json';
import mockPostPaymentMethods from '../mocks/mockPostPaymentMethodsSuccess.json';

export const API_PATHS = {
  BUSINESS_DETAILS: '/entities/business/:id',
  TERMINALS_LIST: 'terminals',
  PKG_VERSION: '/@justifi/webcomponents/latest',
  PAYMENT_METHODS: '/payment_methods',
};

export const setUpMocks = () => {
  createServer({
    routes() {
      // Primary URL prefix for API requests
      this.urlPrefix = 'https://wc-proxy.justifi.ai';
      this.namespace = '/v1';

      // BusinessDetails
      this.get(API_PATHS.BUSINESS_DETAILS, () => mockBusinessDetails);

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
