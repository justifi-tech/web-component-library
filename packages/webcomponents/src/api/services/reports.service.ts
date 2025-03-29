import Api, { IApiResponse } from '../Api';
import { GrossVolumeReport } from '../GrossVolume';

export class ReportsService {
  async fetchGrossVolumeChartData(
    accountId: string,
    authToken: string
  ): Promise<IApiResponse<GrossVolumeReport>> {
    const api = Api({ authToken: authToken, apiOrigin: PROXY_API_ORIGIN });
    const endpoint = `account/${accountId}/reports/gross_volume`;
    return api.get({ endpoint });
  }
}
