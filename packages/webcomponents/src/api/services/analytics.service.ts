import { config } from '../../../config';
import Api from '../Api';

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
    return Api({ apiOrigin: config.proxyApiOrigin }).post(
      endpoint,
      JSON.stringify(body)
    );
  }
}
