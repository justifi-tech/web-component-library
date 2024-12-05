import { Component, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { ComponentError, ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import JustifiAnalytics from '../../api/Analytics';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { config } from '../../../config';
import { PayoutService } from '../../api/services/payout.service';
import { makeGetPayouts } from './get-payouts';
import { makeGetPayoutCSV } from '../payout-details/get-payout-csv';
import { makeGetSubAccounts } from '../../api/get-subaccounts';
import { SubAccountService } from '../../api/services/subaccounts.service';
import { StyledHost, tableExportedParts } from '../../ui-components';
import { defaultColumnsKeys } from './payouts-table';

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
  @State() getPayouts: Function;
  @State() getPayoutCSV: Function;
  @State() getSubAccounts: Function;
  @State() errorMessage: string = null;
  
  @Prop() accountId: string;
  @Prop() authToken: string;
  @Prop() apiOrigin?: string = config.proxyApiOrigin;
  @Prop() columns?: string = defaultColumnsKeys;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;

  analytics: JustifiAnalytics;

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.initializeGetData();
  }

  disconnectedCallback() {
    this.analytics.cleanup();
  }

  @Watch('accountId')
  @Watch('authToken')
  propChanged() {
    this.initializeGetData();
  }

  private initializeGetData() {
    this.initializePayoutsServices();
    this.initializeGetSubAccounts();
  }

  private initializePayoutsServices() {
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
        message: this.errorMessage,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  }

  private initializeGetSubAccounts() {
    if (this.accountId && this.authToken) {
      this.getSubAccounts = makeGetSubAccounts({
        accountId: this.accountId,
        authToken: this.authToken,
        service: new SubAccountService(),
        apiOrigin: this.apiOrigin
      });
    }
  }

  handleOnError = (event) => {
    this.errorMessage = event.detail.message;
    this.errorEvent.emit(event.detail);
  }

  render() {
    return (
      <StyledHost exportedparts={tableExportedParts}>
        <payouts-list-core
          getPayouts={this.getPayouts}
          getPayoutCSV={this.getPayoutCSV}
          getSubAccounts={this.getSubAccounts}
          onError-event={this.handleOnError}
          columns={this.columns}
        />
      </StyledHost>
    );
  }
}
