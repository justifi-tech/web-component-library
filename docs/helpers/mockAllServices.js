import { createServer } from 'miragejs';
import mockBusinessDetails from '../mocks/mockBusinessDetails.json';
import mockOrderModels from '../mocks/mockTerminalModels.json';
import mockNPMVersion from '../mocks/mockNPMVersion.json';

export const API_PATHS = {
  BUSINESS_DETAILS: '/entities/business/:id',
  ORDER_MODELS: '/terminals/order_models',
  ORDER_TERMINALS: '/terminals/orders',
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
