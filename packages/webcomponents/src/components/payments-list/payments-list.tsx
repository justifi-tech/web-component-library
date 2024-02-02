import { Component, h, Prop } from '@stencil/core';
import { PaymentService } from './payment.service';

/**
  * @exportedPart table-head: Table head
  * @exportedPart table-head-row: Head row
  * @exportedPart table-head-cell: Individual head cell
  * @exportedPart table-body: Body of the table
  * @exportedPart table-row: Row of the table
  * @exportedPart table-cell: Individual cell of the table
  * @exportedPart loading-state-cell: Row for loading state
  * @exportedPart loading-state-spinner: Spinner element for loading state
  * @exportedPart error-state: Row for Error state
  * @exportedPart empty-state: Row for Emtpy state
  * @exportedPart pagination-bar: Pagination bar
  * @exportedPart arrow: Both paging buttons
  * @exportedPart arrow-left: Previous page button
  * @exportedPart arrow-right: Next page button
  * @exportedPart button-disabled: Disabled state for paging buttons
  * @exportedPart previous-button-text: Text for Previous button
  * @exportedPart next-button-text: Text for Next button
*/
@Component({
  tag: 'justifi-payments-list',
  shadow: true,
})

export class PaymentsList {
  @Prop() accountId: string;
  @Prop() authToken: string;

  private paymentService = new PaymentService();

  render() {
    return (
      <payments-list-core
        paymentService={this.paymentService}
        account-id={this.accountId}
        auth-token={this.authToken}
      ></payments-list-core>
    );
  }
}
