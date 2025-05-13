import { IApiResponse } from '..';
import Api from '../ApiNew';
import { IDispute } from '../Dispute';

const api = Api();

export interface IDisputeService {
  fetchDispute(
    disputeId: string,
    authToken: string
  ): Promise<IApiResponse<IDispute>>;

  updateDisputeResponse(
    disputeId: string,
    authToken: string,
    payload: any
  ): Promise<IApiResponse<IDispute>>;

  submitDisputeResponse(
    disputeId: string,
    authToken: string,
    payload: any
  ): Promise<IApiResponse<IDispute>>;

  createDisputeEvidence(
    disputeId: string,
    authToken: string,
    payload: string
  ): Promise<IApiResponse<any>>;
}

export class DisputeService implements IDisputeService {
  async fetchDispute(
    disputeId: string,
    authToken: string
  ): Promise<IApiResponse<IDispute>> {
    const endpoint = `disputes/${disputeId}`;
    return api.get({ endpoint, authToken });
  }

  async updateDisputeResponse(
    disputeId: string,
    authToken: string,
    payload: any
  ): Promise<IApiResponse<IDispute>> {
    const endpoint = `disputes/${disputeId}/response`;
    const body = payload;
    return api.patch({ endpoint, body, authToken });
  }

  async submitDisputeResponse(
    disputeId: string,
    authToken: string,
    payload: any
  ): Promise<IApiResponse<IDispute>> {
    const endpoint = `disputes/${disputeId}/response`;
    const body = payload;
    return api.post({ endpoint, body, authToken });
  }

  async createDisputeEvidence(
    disputeId: string,
    authToken: string,
    payload: any
  ): Promise<IApiResponse<any>> {
    const endpoint = `disputes/${disputeId}/evidence`;
    const body = payload;
    return api.put({ endpoint, body, authToken });
  }
}
