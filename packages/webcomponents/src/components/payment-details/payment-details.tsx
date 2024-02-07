import { Component, h, Prop } from '@stencil/core';
import { PaymentService } from '../payments-list/payment.service';

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
  * @exportedPart detail-section
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

  paymentService = new PaymentService();

  render() {
    return (
      <payment-details-core
        paymentId={this.paymentId}
        authToken={this.authToken}
        paymentService={this.paymentService}
      ></payment-details-core>
    );
  }
}
