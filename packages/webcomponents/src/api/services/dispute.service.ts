import { Api, IApiResponse } from '..';
import { IDispute } from '../Dispute';
import { config } from '../../../config';

export interface IDisputeService {
  fetchDispute(
    disputeId: string,
    authToken: string,
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
    return Api({ authToken, apiOrigin: config.proxyApiOrigin }).get(endpoint);
  }

  async updateDisputeResponse(
    disputeId: string,
    authToken: string,
    payload: any
  ): Promise<IApiResponse<IDispute>> {
    const endpoint = `disputes/${disputeId}/response`;
    return Api({ authToken, apiOrigin: config.proxyApiOrigin }).patch(endpoint, payload);
  }

  async submitDisputeResponse(
    disputeId: string,
    authToken: string,
    payload: any
  ): Promise<IApiResponse<IDispute>> {
    const endpoint = `disputes/${disputeId}/response`;
    return Api({ authToken, apiOrigin: config.proxyApiOrigin }).post(endpoint, payload);
  }

  async createDisputeEvidence(
    disputeId: string,
    authToken: string,
    payload: any
  ): Promise<IApiResponse<any>> {
    const endpoint = `disputes/${disputeId}/evidence`;
    return Api({ authToken, apiOrigin: config.proxyApiOrigin }).put(endpoint, payload);
  }
}
