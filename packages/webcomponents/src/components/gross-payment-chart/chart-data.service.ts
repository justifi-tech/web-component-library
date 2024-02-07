import { Api, IApiResponse } from '../../api';
import { config } from '../../../config';
import { GrossVolumeReport } from '../../api/GrossVolume';

export interface IChartDataService {
  fetchChartData(
    accountId: string,
    authToken: string,
  ): Promise<IApiResponse<GrossVolumeReport>>;
}

export class ChartDataService implements IChartDataService {
  async fetchChartData(
    accountId: string,
    authToken: string,
  ): Promise<IApiResponse<GrossVolumeReport>> {
    const api = Api(authToken, config.proxyApiOrigin);
    const endpoint = `account/${accountId}/reports/gross_volume`;
    return api.get(endpoint);
  }
}