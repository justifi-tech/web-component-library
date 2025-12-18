import { createServer } from 'miragejs';
import mockBusinessDetails from '../mocks/mockBusinessDetails.json';
import mockTerminals from '../mocks/mockTerminalsListSuccess.json';
import mockNPMVersion from '../mocks/mockNPMVersion.json';

export const API_PATHS = {
  BUSINESS_DETAILS: '/entities/business/:id',
  TERMINALS_LIST: 'terminals',
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

      // TerminalsList
      this.get(API_PATHS.TERMINALS_LIST, () => mockTerminals);

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
