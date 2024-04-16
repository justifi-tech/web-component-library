import { Component, Host, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { tableExportedParts } from '../table/exported-parts';
import { PayoutService } from '../../api/services/payout.service';
import { makeGetPayouts } from './get-payouts';
import { ErrorState } from '../details/utils';
import { ComponentError, ComponentErrorCodes } from '../../api/ComponentError';

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

  @State() getPayouts: Function;
  @State() errorMessage: string = null;

  @Event() errorEvent: EventEmitter<ComponentError>;

  componentWillLoad() {
    this.initializeGetPayouts();
  }

  @Watch('accountId')
  @Watch('authToken')
  propChanged() {
    this.initializeGetPayouts();
  }

  private initializeGetPayouts() {
    if (this.accountId && this.authToken) {
      this.getPayouts = makeGetPayouts({
        id: this.accountId,
        authToken: this.authToken,
        service: new PayoutService(),
      });
    } else {
      this.errorMessage = 'Account ID and Auth Token are required';
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        message: 'Account ID and Auth Token are required',
      });
    }
  }

  handleOnError = (event) => {
    this.errorMessage = event.detail.message;
    this.errorEvent.emit(event.detail);
  }

  render() {
    if (this.errorMessage) {
      return ErrorState(this.errorMessage);
    }

    return (
      <Host exportedparts={tableExportedParts}>
        <payouts-list-core getPayouts={this.getPayouts} onErrorEvent={this.handleOnError} />
      </Host>
    );
  }
}
