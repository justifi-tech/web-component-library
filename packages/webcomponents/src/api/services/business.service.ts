import Api, { IApiResponse } from '../Api';
import { IBankAccount } from '../BankAccount';
import { IBusiness } from '../Business';
import { DocumentRecordData } from '../Document';
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
    authToken: string,
    apiOrigin: string = PROXY_API_ORIGIN
  ): Promise<IApiResponse<IBusiness>> {
    const endpoint = `entities/business/${businessId}`;
    return Api({ authToken, apiOrigin }).get(endpoint);
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

// Business Identity API Services for PaymentProvisioning Component

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

// Business Bank Account API Services for PaymentProvisioning Component

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
    return Api({ authToken, apiOrigin: PROXY_API_ORIGIN }).post(
      endpoint,
      payload
    );
  }
}

// Business Document Uploading API Services for PaymentProvisioning Component

export interface IDocumentRecordService {
  postDocumentRecord(
    authToken: string,
    payload: DocumentRecordData
  ): Promise<IApiResponse<any>>;
}

export class DocumentRecordService implements IDocumentRecordService {
  async postDocumentRecord(
    authToken: string,
    payload: DocumentRecordData
  ): Promise<IApiResponse<any>> {
    const endpoint = `entities/document`;
    return Api({ authToken, apiOrigin: PROXY_API_ORIGIN }).post(
      endpoint,
      payload
    );
  }
}
