import { Component, Host, Prop, State, h } from '@stencil/core';
import { Business, IBusiness } from '../../api/Business';
import { Api, IApiResponse } from '../../api';
import { ErrorState, LoadingState } from '../details/utils';
import { config } from '../../../config';

enum RENDER_STATES {
  LOADING = 'loading',
  READY = 'ready',
  ERROR = 'error',
}

/**
 *
 * @exportedPart detail-section
 * @exportedPart detail-section-title
 * @exportedPart detail-section-item-title
 * @exportedPart detail-section-item-data
 * @exportedPart detail-empty-state
 */
@Component({
  tag: 'justifi-business-details',
  styleUrl: 'business-details.scss',
  shadow: true,
})
export class BusinessDetails {
  @Prop() businessId: string;
  @Prop() authToken: string;
  @State() business: Business;
  @State() renderState: RENDER_STATES = RENDER_STATES.LOADING;
  @State() errorMessage: string = 'An error ocurred.';

  private api: any;

  constructor() {
    this.fetchBusiness = this.fetchBusiness.bind(this);
  }

  async componentWillLoad() {
    if (!this.authToken) {
      this.errorMessage = 'Missing auth-token. The form will not be functional without it.';
      console.error(this.errorMessage);
      return;
    }

    if (!this.businessId) {
      this.errorMessage = 'Missing business-id. The form will not be functional without it.';
      console.error(this.errorMessage);
      return;
    }

    this.api = Api(this.authToken, config.proxyApiOrigin);
    await this.fetchBusiness(this.businessId);
  }

  async fetchBusiness(businessId) {
    this.renderState = RENDER_STATES.LOADING;
    try {
      const response: IApiResponse<IBusiness> = await this.api.get(`entities/business/${businessId}`);
      if (response.error) {
        this.errorMessage = `${this.errorMessage}: ${response.error}`;
        console.error(this.errorMessage);
        this.renderState = RENDER_STATES.ERROR;
        return;
      }
      this.business = new Business(response.data);
      this.renderState = RENDER_STATES.READY;
    } catch (error) {
      this.errorMessage = `${this.errorMessage}: ${error}`;
      console.error(this.errorMessage);
      this.renderState = RENDER_STATES.ERROR;
    } finally {
      this.renderState = RENDER_STATES.READY;
    }
  }

  render() {
    if (this.renderState === RENDER_STATES.LOADING) {
      return <Host>{LoadingState}</Host>;
    }

    if (this.renderState === RENDER_STATES.ERROR) {
      return <Host>{ErrorState(this.errorMessage)}</Host>;
    }

    return (
      <Host>
        <generic-info-details business={this.business} />
        <legal-address-details legalAddress={this.business.legal_address} />
        <representative-details
          representative={this.business.representative}
        />
        <owner-details owners={this.business.owners} />
        <additional-questions-details additionalQuestions={this.business.additional_questions} />
      </Host>
    );
  }
}
