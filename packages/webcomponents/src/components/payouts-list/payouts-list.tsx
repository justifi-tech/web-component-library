import { Component, Host, h, Prop } from '@stencil/core';
import { tableExportedParts } from '../table/exported-parts';
import { PayoutService } from './payout.service';

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
  tag: 'justifi-payouts-list',
  shadow: true,
})

export class PayoutsList {
  @Prop() accountId: string;
  @Prop() authToken: string;

  private payoutService = new PayoutService();

  render() {
    return (
      <Host exportedparts={tableExportedParts}>
        <payouts-list-core
          accountId={this.accountId}
          authToken={this.authToken}
          payoutService={this.payoutService}
        />
      </Host>
    );
  }
}
