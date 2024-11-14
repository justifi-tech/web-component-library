import { Component, Host, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { tableExportedParts } from '../table/exported-parts';
import { PayoutService } from '../../api/services/payout.service';
import { makeGetPayouts } from './get-payouts';
import { ComponentError, ComponentErrorCodes } from '../../api/ComponentError';
import JustifiAnalytics from '../../api/Analytics';
import { makeGetPayoutCSV } from '../payout-details/get-payout-csv';
import { checkPkgVersion } from '../../utils/check-pkg-version';

/**
  * @exportedPart label: Label for inputs
  * @exportedPart input: The input fields
  * @exportedPart input-invalid: Invalid state for inputs
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
  @State() getPayoutCSV: Function;
  @State() errorMessage: string = null;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;

  analytics: JustifiAnalytics;

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.initializeServices();
  }

  disconnectedCallback() {
    this.analytics.cleanup();
  }

  @Watch('accountId')
  @Watch('authToken')
  propChanged() {
    this.initializeServices();
  }

  private initializeServices() {
    if (this.accountId && this.authToken) {
      const serviceParams = {
        id: this.accountId,
        authToken: this.authToken,
        service: new PayoutService(),
      };
      this.getPayouts = makeGetPayouts(serviceParams);
      this.getPayoutCSV = makeGetPayoutCSV(serviceParams);
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
    return (
      <Host exportedparts={tableExportedParts}>
        <payouts-list-core
          getPayouts={this.getPayouts}
          getPayoutCSV={this.getPayoutCSV}
          onError-event={this.handleOnError}
        />
      </Host>
    );
  }
}
