import { createServer } from 'miragejs';
import mockBusinessDetails from '../../../../mockData/mockBusinessDetails.json';

export const mockAllServices = () => {
  createServer({
    routes() {
      this.urlPrefix = 'https://wc-proxy.justifi.ai/v1';

      // The rest of the routes will be created in the following PRs
      this.namespace = '/entities/business';

      // To test an error response, just replace 'mockBusinessDetails' by an error response
      this.get('/:id', () => mockBusinessDetails);
    },
  });
};
