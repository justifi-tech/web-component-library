import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { PaymentService } from '../../api/services/payment.service';
import { makeGetPaymentDetails } from './get-payment-details';
import { ErrorState } from '../details/utils';
import { API_ERRORS } from '../../api/shared';

/**
  * @exportedPart detail-loading-spinner
  * @exportedPart detail-loading-state
  * @exportedPart detail-empty-state
  * @exportedPart detail-head
  * @exportedPart detail-title
  * @exportedPart detail-method
  * @exportedPart detail-info
  * @exportedPart detail-info-item
  * @exportedPart detail-info-item-title
  * @exportedPart detail-info-item-data
  * @exportedPart detail-metadata
  * @exportedPart detail-metadata-title
  * @exportedPart detail-method-title
  * @exportedPart detail-method-data
  * @exportedPart detail-section-title
  * @exportedPart detail-section-item-title
  * @exportedPart detail-section-item-data
  * @exportedPart detail-head-info
  * @exportedPart detail-head-info-item
  * @exportedPart detail-head-info-item-title
  * @exportedPart detail-head-info-item-data
*/
@Component({
  tag: 'justifi-payment-details',
  shadow: true,
})

export class PaymentDetails {
  @Prop() paymentId: string;
  @Prop() authToken: string;

  @State() getPaymentDetails: Function;
  @State() errorMessage: string = null;

  @Event() tokenExpired: EventEmitter<any>;

  componentWillLoad() {
    this.initializeGetPaymentDetails();
  }

  @Watch('paymentId')
  @Watch('authToken')
  propChanged() {
    this.initializeGetPaymentDetails();
  }

  private initializeGetPaymentDetails() {
    if (this.paymentId && this.authToken) {
      this.getPaymentDetails = makeGetPaymentDetails({
        id: this.paymentId,
        authToken: this.authToken,
        service: new PaymentService(),
      });
    } else {
      this.errorMessage = 'Payment ID and Auth Token are required';
    }
  }

  handleError = (event) => {
    if (event.detail === API_ERRORS.NOT_AUTHENTICATED) {
      this.tokenExpired.emit({ bubbles: true, composed: true });
    }
  }

  render() {
    if (this.errorMessage) {
      return ErrorState(this.errorMessage);
    }
    return (
      <payment-details-core
        getPaymentDetails={this.getPaymentDetails}
        onErrorEvent={this.handleError}
      />
    );
  }
}
