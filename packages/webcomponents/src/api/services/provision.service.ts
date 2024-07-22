import { config } from '../../../config';
import Api, { IApiResponse } from '../Api';

export interface IProvisionService {
  postProvisioning(
    authToken: string,
    businessId: string,
    product: string
  ): Promise<IApiResponse<any>>;
};

export class ProvisionService implements IProvisionService {
  async postProvisioning(
    authToken: string,
    businessId: string,
    product: string
  ): Promise<IApiResponse<any>> {
    const endpoint = `entities/provisioning`;
    const payload = {
      business_id: businessId,
      product_category: product
    };
    return Api({ authToken, apiOrigin: config.proxyApiOrigin }).post(
      endpoint,
      JSON.stringify(payload)
    );
  }
}
