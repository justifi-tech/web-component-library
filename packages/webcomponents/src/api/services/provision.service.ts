import Api, { IApiResponse } from '../Api';

export interface IProvisionService {
  postProvisioning(
    authToken: string,
    businessId: string,
    product: string
  ): Promise<IApiResponse<any>>;
}

export class ProvisionService implements IProvisionService {
  async postProvisioning(
    authToken: string,
    businessId: string,
    product: string
  ): Promise<IApiResponse<any>> {
    const endpoint = `entities/provisioning`;
    const payload = {
      business_id: businessId,
      product_category: product,
    };
    return Api({ authToken, apiOrigin: PROXY_API_ORIGIN }).post(
      endpoint,
      payload
    );
  }
}
