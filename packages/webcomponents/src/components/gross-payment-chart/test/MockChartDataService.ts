import { IApiResponse } from "../../../api";
import { GrossVolumeReport } from "../../../api/GrossVolume";
import { IChartDataService } from "../chart-data.service";

export interface MockChartDataServiceConstructorArgs {
  fetchChartDataResponse: IApiResponse<GrossVolumeReport>;
}

export class MockChartDataService implements IChartDataService {
  private fetchChartDataResponse: IApiResponse<GrossVolumeReport>;

  constructor({ fetchChartDataResponse }: MockChartDataServiceConstructorArgs) {
    fetchChartDataResponse = fetchChartDataResponse;
  }

  async fetchChartData(
    _accountId: string,
    _authToken: string
  ): Promise<IApiResponse<GrossVolumeReport>> {
    return Promise.resolve(this.fetchChartDataResponse);
  }
}
