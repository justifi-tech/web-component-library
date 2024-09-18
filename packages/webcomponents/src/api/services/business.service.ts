import Api, { IApiResponse } from '../Api';
import { IBusiness } from '../Business';
import { Identity } from '../Identity';

export interface IBusinessService {
  fetchBusiness(
    businessId: string,
    authToken: string
  ): Promise<IApiResponse<IBusiness>>;

  patchBusiness(
    authToken: string,
    businessId: string,
    payload: Partial<IBusiness>
  ): Promise<IApiResponse<IBusiness>>;
}
export class BusinessService implements IBusinessService {
  async fetchBusiness(
    businessId: string,
    authToken: string
  ): Promise<IApiResponse<IBusiness>> {
    const endpoint = `entities/business/${businessId}`;
    return Api({ authToken, apiOrigin: PROXY_API_ORIGIN }).get(endpoint);
  }

  async patchBusiness(
    authToken: string,
    businessId: string,
    payload: Partial<IBusiness>
  ): Promise<IApiResponse<IBusiness>> {
    const endpoint = `entities/business/${businessId}`;
    return Api({ authToken, apiOrigin: PROXY_API_ORIGIN }).patch(
      endpoint,
      payload
    );
  }
}

export interface IdentityService {
  fetchIdentity(
    identityId: string,
    authToken: string
  ): Promise<IApiResponse<Identity>>;

  patchIdentity(
    authToken: string,
    identityId: string,
    payload: Partial<Identity>
  ): Promise<IApiResponse<Identity>>;

  postIdentity(
    authToken: string,
    payload: Partial<Identity>
  ): Promise<IApiResponse<Identity>>;
}

export class IdentityService implements IdentityService {
  async fetchIdentity(
    identityId: string,
    authToken: string
  ): Promise<IApiResponse<Identity>> {
    const endpoint = `entities/identity/${identityId}`;
    return Api({ authToken, apiOrigin: PROXY_API_ORIGIN }).get(endpoint);
  }

  async patchIdentity(
    authToken: string,
    identityId: string,
    payload: Partial<Identity>
  ): Promise<IApiResponse<Identity>> {
    const endpoint = `entities/identity/${identityId}`;
    return Api({ authToken, apiOrigin: PROXY_API_ORIGIN }).patch(
      endpoint,
      payload
    );
  }

  async postIdentity(
    authToken: string,
    payload: Partial<Identity>
  ): Promise<IApiResponse<Identity>> {
    const endpoint = `entities/identity`;
    return Api({ authToken, apiOrigin: PROXY_API_ORIGIN }).post(
      endpoint,
      payload
    );
  }
}
