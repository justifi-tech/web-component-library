import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { makeGetCheckouts } from '../../actions/checkout/get-checkouts';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import JustifiAnalytics from '../../api/Analytics';
import { CheckoutService } from '../../api/services/checkout.service';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import { SubAccountService } from '../../api/services/subaccounts.service';
import { makeGetSubAccounts } from '../../actions/sub-account/get-subaccounts';
import { StyledHost } from '../../ui-components';
import { defaultColumnsKeys } from './checkouts-table';
import { ComponentErrorEvent } from '../../api/ComponentEvents';

@Component({
  tag: 'justifi-checkouts-list',
  shadow: true
})

export class CheckoutsList {
  @State() getCheckouts: Function;
  @State() getSubAccounts: Function;
  @State() errorMessage: string = null;

  @Prop() accountId: string;
  @Prop() authToken: string;
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
    this.initializeGetCheckouts();
    this.initializeGetSubAccounts();
  }

  private initializeGetCheckouts() {
    if (this.accountId && this.authToken) {
      this.getCheckouts = makeGetCheckouts({
        accountId: this.accountId,
        authToken: this.authToken,
        service: new CheckoutService()
      });
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
        service: new SubAccountService()
      });
    }
  }

  handleErrorEvent = (event) => {
    this.errorMessage = event.detail.message;
    this.errorEvent.emit(event.detail);
  };

  render() {
    return (
      <StyledHost>
        <checkouts-list-core
          getCheckouts={this.getCheckouts}
          getSubAccounts={this.getSubAccounts}
          onError-event={this.handleErrorEvent}
          columns={this.columns}
        />
      </StyledHost>
    );
  }
}
