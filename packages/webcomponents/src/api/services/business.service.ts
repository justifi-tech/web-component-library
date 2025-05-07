import {Api, DocumentRecordData, IApiResponse, IBankAccount, IBusiness, Identity } from '..';

const api = Api();

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
    return api.get({ endpoint, authToken });
  }

  async patchBusiness(
    authToken: string,
    businessId: string,
    payload: Partial<IBusiness>
  ): Promise<IApiResponse<IBusiness>> {
    const endpoint = `entities/business/${businessId}`;
    const body = payload;
    return api.patch({ endpoint, body, authToken });
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
    return api.get({ endpoint, authToken });
  }

  async patchIdentity(
    authToken: string,
    identityId: string,
    payload: Partial<Identity>
  ): Promise<IApiResponse<Identity>> {
    const endpoint = `entities/identity/${identityId}`;
    const body = payload;
    return api.patch({ endpoint, body, authToken });
  }

  async postIdentity(
    authToken: string,
    payload: Partial<Identity>
  ): Promise<IApiResponse<Identity>> {
    const endpoint = `entities/identity`;
    const body = payload;
    return api.post({ endpoint, body, authToken });
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
    const body = payload;
    return api.post({ endpoint, body, authToken });
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
    const body = payload;
    return api.post({ endpoint, body, authToken });
  }
}
