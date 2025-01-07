import { config } from '../../../config';
import Api, { IApiResponse } from '../Api';
import { IBankAccount } from '../BankAccount';
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
    return Api({ authToken, apiOrigin: config.proxyApiOrigin }).get(endpoint);
  }

  async patchIdentity(
    authToken: string,
    identityId: string,
    payload: Partial<Identity>
  ): Promise<IApiResponse<Identity>> {
    const endpoint = `entities/identity/${identityId}`;
    return Api({ authToken, apiOrigin: config.proxyApiOrigin }).patch(endpoint, payload);
  }

  async postIdentity(
    authToken: string,
    payload: Partial<Identity>
  ): Promise<IApiResponse<Identity>> {
    const endpoint = `entities/identity`;
    return Api({ authToken, apiOrigin: config.proxyApiOrigin }).post(endpoint, payload);
  }
}

export interface IBusinessBankAccountService {
  postBankAccount(
    authToken: string,
    payload: Partial<IBankAccount>
  ): Promise<IApiResponse<IBankAccount>>;
}

export class BusinessBankAccountService implements IBusinessBankAccountService {
  async postBankAccount(
    authToken: string,
    payload: Partial<IBankAccount>
  ): Promise<IApiResponse<IBankAccount>> {
    const endpoint = `entities/bank_accounts`;
    return Api({ authToken, apiOrigin: config.proxyApiOrigin }).post(endpoint, payload);
  }
}
