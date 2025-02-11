import { Component, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import JustifiAnalytics from '../../api/Analytics';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { PayoutService } from '../../api/services/payout.service';
import { makeGetPayouts } from '../../actions/payout/get-payouts';
import { makeGetPayoutCSV } from '../payout-details/get-payout-csv';
import { SubAccountService } from '../../api/services/subaccounts.service';
import { StyledHost, tableExportedParts } from '../../ui-components';
import { defaultColumnsKeys } from './payouts-table';
import { ComponentErrorEvent } from '../../api/ComponentEvents';
import { makeGetSubAccounts } from '../../actions/sub-account/get-subaccounts';

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
  @Prop() apiOrigin?: string = PROXY_API_ORIGIN;
  @Prop() columns?: string = defaultColumnsKeys;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;

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
        apiOrigin: this.apiOrigin
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
