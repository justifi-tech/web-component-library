import { IApiResponse } from '../Api';
import Api from '../ApiNew';
import { GrossVolumeReport } from '../GrossVolume';

const api = Api();
export class ReportsService {
  async fetchGrossVolumeChartData(
    accountId: string,
    authToken: string
  ): Promise<IApiResponse<GrossVolumeReport>> {
    const endpoint = `account/${accountId}/reports/gross_volume`;
    return api.get({ endpoint, authToken });
  }
}
