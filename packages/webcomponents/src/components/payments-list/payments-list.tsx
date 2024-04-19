import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { PaymentService } from '../../api/services/payment.service';
import { makeGetPayments } from './get-payments';
import { ErrorState } from '../details/utils';
import { ComponentError, ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';

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
  tag: 'justifi-payments-list',
  shadow: true,
})

export class PaymentsList {
  @Prop() accountId: string;
  @Prop() authToken: string;

  @State() getPayments: Function;
  @State() errorMessage: string = null;

  @Event() errorEvent: EventEmitter<ComponentError>;

  componentWillLoad() {
    this.initializeGetPayments();
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
        onErrorEvent={this.handleErrorEvent}
      />
    );
  }
}
