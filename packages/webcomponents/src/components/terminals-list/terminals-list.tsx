import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { ComponentError, ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import JustifiAnalytics from '../../api/Analytics';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { config } from '../../../config';
import { TerminalService } from '../../api/services/terminal.service';
import { makeGetTerminals } from './get-terminals';
import { SubAccountService } from '../../api/services/subaccounts.service';
import { makeGetSubAccounts } from '../../api/get-subaccounts';
import { StyledHost } from '../../ui-components';
import { defaultColumnsKeys } from './terminals-table';

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
    this.initializeGetTerminals();
    this.initializeGetSubAccounts();
  }

  private initializeGetTerminals() {
    if (this.accountId && this.authToken) {
      this.getTerminals = makeGetTerminals({
        id: this.accountId,
        authToken: this.authToken,
        service: new TerminalService(),
        apiOrigin: this.apiOrigin
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
        service: new SubAccountService(),
        apiOrigin: this.apiOrigin
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
