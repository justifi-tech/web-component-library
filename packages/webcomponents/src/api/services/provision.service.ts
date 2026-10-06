import { Api, IApiResponse } from "..";

const api = Api();

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
    const body = {
      business_id: businessId,
      product_category: product,
    };
    return api.post({ endpoint, body, authToken });
  }
}
