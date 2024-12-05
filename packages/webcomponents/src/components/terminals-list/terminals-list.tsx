import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { ComponentError, ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import JustifiAnalytics from '../../api/Analytics';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { config } from '../../../config';
import { TerminalService } from '../../api/services/terminal.service';
import { makeGetTerminals } from './get-terminals';
import { SubAccountService } from '../../api/services/subaccounts.service';
import { makeGetSubAccounts } from '../../api/get-subaccounts';
import { StyledHost, tableExportedParts } from '../../ui-components';

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
  * @exportedPart pagination: Pagination bar
  * @exportedPart page-item: Pagination button
  * @exportedPart page-link: Pagination link
  * @exportedPart page-link-disabled: Disabled pagination link
*/
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
  @Prop() columns: string;

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
      <StyledHost exportparts={tableExportedParts}>
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
