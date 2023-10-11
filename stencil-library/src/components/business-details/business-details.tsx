import { Component, Host, Prop, State, h } from '@stencil/core';
import { IBusiness } from '../../api/Business';
import { Api } from '../../api';
import { ErrorState, LoadingState } from '../details/utils'; // Make sure to adjust the path if necessary

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
  @State() business: IBusiness;
  @State() renderState: RENDER_STATES = RENDER_STATES.LOADING;
  @State() errorMessage: string = 'An error ocurred.';

  private api: any;

  constructor() {
    this.fetchBusiness = this.fetchBusiness.bind(this);
    this.setError = this.setError.bind(this);
  }

  async componentWillLoad() {
    if (!this.authToken) {
      this.setError(
        'Missing auth-token. The form will not be functional without it.',
      );
      return;
    }

    if (!this.businessId) {
      this.setError(
        'Missing business-id. The form will not be functional without it.',
      );
      return;
    }

    this.api = Api(this.authToken, process.env.ENTITIES_ENDPOINT);
    await this.fetchBusiness(this.businessId);
  }

  async fetchBusiness(businessId) {
    this.renderState = RENDER_STATES.LOADING;
    try {
      const response = await this.api.get(`entities/business/${businessId}`);
      if (response.error) {
        this.setError(response.error.message);
        return;
      }
      this.business = response.data;
      this.renderState = RENDER_STATES.READY;
    } catch (error) {
      this.setError(error);
    }
  }

  setError(error: string) {
    this.errorMessage = error || this.errorMessage;
    this.renderState = RENDER_STATES.ERROR;
  }

  render() {
    if (this.renderState === RENDER_STATES.LOADING) {
      return LoadingState;
    }

    if (this.renderState === RENDER_STATES.ERROR) {
      return ErrorState(this.errorMessage);
    }

    return (
      <Host>
        <business-details-section business={this.business} />
        <representative-details-section business={this.business} />
        <owner-details-section business={this.business} />
      </Host>
    );
  }
}
