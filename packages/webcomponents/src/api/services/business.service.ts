import { config } from '../../../config';
import Api, { IApiResponse } from '../Api';
import { IBusiness } from '../Business';

export interface IBusinessService {
  fetchBusiness(
    businessId: string,
    authToken: string
  ): Promise<IApiResponse<IBusiness>>;
}

export class BusinessService implements IBusinessService {
  async fetchBusiness(
    businessId: string,
    authToken: string
  ): Promise<IApiResponse<IBusiness>> {
    const endpoint = `entities/business/${businessId}`;
    return Api({ authToken, apiOrigin: config.proxyApiOrigin }).get(endpoint);
  }

  async patchBusiness(
    authToken: string,
    businessId: string,
    payload: Partial<IBusiness>
  ): Promise<IApiResponse<IBusiness>> {
    const endpoint = `entities/business/${businessId}`;
    return Api({ authToken, apiOrigin: config.proxyApiOrigin }).patch(endpoint, payload);
  }
}
