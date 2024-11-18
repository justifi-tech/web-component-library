import { Api, IApiResponse } from '..';
import { IDispute } from '../Dispute';
import { config } from '../../../config';

export interface IDisputeService {
  fetchDispute(
    disputeId: string,
    authToken: string
  ): Promise<IApiResponse<IDispute>>;

  fetchDisputeResponse(
    disputeId: string,
    authToken: string
  ): Promise<IApiResponse<IDispute>>;

  updateDisputeResponse(
    disputeId: string,
    authToken: string
  ): Promise<IApiResponse<IDispute>>;

  submitDisputeResponse(
    disputeId: string,
    authToken: string
  ): Promise<IApiResponse<IDispute>>;
}

export class DisputeService implements IDisputeService {
  async fetchDispute(
    disputeId: string,
    authToken: string
  ): Promise<IApiResponse<IDispute>> {
    const endpoint = `disputes/${disputeId}`;
    return Api({ authToken, apiOrigin: config.proxyApiOrigin }).get(endpoint);
  }

  async fetchDisputeResponse(
    disputeId: string,
    authToken: string
  ): Promise<IApiResponse<IDispute>> {
    const endpoint = `disputes/${disputeId}/response`;
    return Api({ authToken, apiOrigin: config.proxyApiOrigin }).get(endpoint);
  }

  async updateDisputeResponse(
    disputeId: string,
    authToken: string
  ): Promise<IApiResponse<IDispute>> {
    const endpoint = `disputes/${disputeId}/response`;
    return Api({ authToken, apiOrigin: config.proxyApiOrigin }).patch(endpoint);
  }

  async submitDisputeResponse(
    disputeId: string,
    authToken: string
  ): Promise<IApiResponse<IDispute>> {
    const endpoint = `disputes/${disputeId}/response`;
    return Api({ authToken, apiOrigin: config.proxyApiOrigin }).post(endpoint);
  }
}
