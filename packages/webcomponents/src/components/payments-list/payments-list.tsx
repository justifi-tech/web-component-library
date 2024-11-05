import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { PaymentService } from '../../api/services/payment.service';
import { makeGetPayments } from './get-payments';
import { ErrorState } from '../../ui-components/details/utils';
import { ComponentError, ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import JustifiAnalytics from '../../api/Analytics';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { tableExportedParts } from '../../ui-components/table/exported-parts';

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
  tag: 'justifi-payments-list',
  shadow: true,
})

export class PaymentsList {
  @Prop() accountId: string;
  @Prop() authToken: string;

  @State() getPayments: Function;
  @State() errorMessage: string = null;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;

  analytics: JustifiAnalytics;

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.initializeGetPayments();
  }

  disconnectedCallback() {
    this.analytics.cleanup();
  }

  @Watch('accountId')
  @Watch('authToken')
  propChanged() {
    this.initializeGetPayments();
  }

  private initializeGetPayments() {
    if (this.accountId && this.authToken) {
      this.getPayments = makeGetPayments({
        id: this.accountId,
        authToken: this.authToken,
        service: new PaymentService(),
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

  handleErrorEvent = (event) => {
    this.errorMessage = event.detail.message;
    this.errorEvent.emit(event.detail);
  };

  render() {
    if (this.errorMessage) {
      return ErrorState(this.errorMessage);
    }
    return (
      <payments-list-core
        getPayments={this.getPayments}
        onError-event={this.handleErrorEvent}
        exportparts={tableExportedParts}
      />
    );
  }
}
