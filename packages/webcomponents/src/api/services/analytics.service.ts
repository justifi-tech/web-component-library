import Api from '../Api';
import { config } from '../../../config';

interface iAnayticsBody {
  event_type: string;
  data: {
    component_name: string;
    component_version: string;
    client_user_agent: string;
    client_platform: string;
    client_origin: string;
    error?: any;
  };
}

export class AnalyticsService {
  async record(body: iAnayticsBody): Promise<void> {
    const endpoint = 'analytics';
    console.log('analytics.service PROXY_API_ORIGIN: ', config.proxyApiOrigin);
    return Api({ apiOrigin: config.proxyApiOrigin }).post(
      endpoint,
      JSON.stringify(body)
    );
  }
}
