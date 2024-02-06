import { Api } from '../../api';
import { config } from '../../../config';
import { GrossVolumeReponseType } from '../../api/GrossVolume';

export interface IChartDataService {
  fetchChartData(
    accountId: string,
    authToken: string,
  ): Promise<GrossVolumeReponseType>;
}

export class ChartDataService implements IChartDataService {
  async fetchChartData(
    accountId: string,
    authToken: string,
  ): Promise<GrossVolumeReponseType> {
    const api = Api(authToken, config.proxyApiOrigin);
    const endpoint = `account/${accountId}/reports/gross_volume`;
    return api.get(endpoint);
  }
}