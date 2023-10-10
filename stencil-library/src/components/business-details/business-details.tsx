import { Component, Prop, State, h } from '@stencil/core';
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
  @State() renderState: RENDER_STATES = RENDER_STATES.READY;

  private api: any;

  componentWillLoad() {
    if (!this.authToken) {
      console.warn(
        'Warning: Missing auth-token. The form will not be functional without it.',
      );
    }

    try {
      this.api = Api(this.authToken, process.env.ENTITIES_ENDPOINT);
      this.fetchBusiness(this.businessId);
    } catch (error) {
      console.error('Error fetching data:', error);
      this.renderState = RENDER_STATES.ERROR;
    }
  }

  constructor() {
    this.fetchBusiness = this.fetchBusiness.bind(this);
  }

  async fetchBusiness(businessId) {
    this.renderState = RENDER_STATES.LOADING;
    try {
      const response = await this.api.get(`entities/businesss/${businessId}`);
      this.business = response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      this.renderState = RENDER_STATES.ERROR;
    } finally {
      this.renderState = RENDER_STATES.READY;
    }
  }

  render() {
    if (this.renderState === RENDER_STATES.LOADING) {
      return LoadingState;
    }

    if (this.renderState === RENDER_STATES.ERROR) {
      return ErrorState('Error');
    }

    return (
      <div>
        <business-details-section business={this.business} />
        <representative-details-section business={this.business} />
        <owner-details-section business={this.business} />
      </div>
    );
  }
}
