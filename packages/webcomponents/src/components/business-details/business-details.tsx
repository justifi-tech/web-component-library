import { Component, Event, EventEmitter, Host, Prop, State, h } from '@stencil/core';
import { ErrorState } from '../details/utils';
import { BusinessService } from '../../api/services/business.service';
import { makeGetBusiness } from './get-business';
import { API_ERRORS } from '../../api/shared';

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
  shadow: true,
})
export class BusinessDetails {
  @Prop() businessId: string;
  @Prop() authToken: string;

  @State() errorMessage: string;
  @State() getBusiness: Function;

  @Event() tokenExpired: EventEmitter<any>;

  componentWillLoad() {
    this.initializeGetBusiness();
  }

  private initializeGetBusiness() {
    if (!this.businessId || !this.authToken) {
      this.errorMessage = 'Invalid business id or auth token';
      return;
    }

    this.getBusiness = makeGetBusiness({
      id: this.businessId,
      authToken: this.authToken,
      service: new BusinessService(),
    });
  }

  handleError = (event) => {
    if (event.detail === API_ERRORS.NOT_AUTHENTICATED) {
      this.tokenExpired.emit();
    }
  };

  render() {
    if (this.errorMessage) {
      return <Host>{ErrorState(this.errorMessage)}</Host>;
    }
    return (
      <business-details-core
        getBusiness={this.getBusiness}
        onErrorEvent={this.handleError}
      />
    );
  }
}
