import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import JustifiAnalytics from '../../api/Analytics';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { TerminalService } from '../../api/services/terminal.service';
import { makeGetTerminals } from '../../actions/terminal/get-terminals';
import { SubAccountService } from '../../api/services/subaccounts.service';
import { StyledHost } from '../../ui-components';
import { defaultColumnsKeys } from './terminals-table';
import { ComponentErrorEvent } from '../../api/ComponentEvents';
import { makeGetSubAccounts } from '../../actions/sub-account/get-subaccounts';

@Component({
  tag: 'justifi-terminals-list',
  shadow: true
})

export class TerminalsList {
  @State() getTerminals: Function;
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
    this.analytics && this.analytics.cleanup();
  };

  @Watch('accountId')
  @Watch('authToken')
  propChanged() {
    this.initializeGetData();
  }

  private initializeGetData() {
    this.initializeGetTerminals();
    this.initializeGetSubAccounts();
  }

  private initializeGetTerminals() {
    if (this.accountId && this.authToken) {
      this.getTerminals = makeGetTerminals({
        id: this.accountId,
        authToken: this.authToken,
        service: new TerminalService()
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
        <terminals-list-core
          getTerminals={this.getTerminals}
          getSubAccounts={this.getSubAccounts}
          onError-event={this.handleErrorEvent}
          columns={this.columns}
        />
      </StyledHost>
    );
  }
};
