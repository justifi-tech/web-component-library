import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { makeGetCheckoutsList } from './get-checkouts';
import { ErrorState } from '../details/utils';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { config } from '../../../config';
import JustifiAnalytics from '../../api/Analytics';
import { CheckoutService } from '../../api/services/checkout.service';
import { ComponentError, ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';

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
  tag: 'justifi-checkouts-list',
  shadow: true
})

export class CheckoutsList {
  @State() getCheckoutsList: Function;
  @State() errorMessage: string = null;

  @Prop() accountId: string;
  @Prop() authToken: string;
  @Prop() apiOrigin?: string = config.proxyApiOrigin;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;

  analytics: JustifiAnalytics;

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.initializeGetCheckoutsList();
  }

  disconnectedCallback() {
    this.analytics.cleanup();
  }

  @Watch('accountId')
  @Watch('authToken')
  propChanged() {
    this.initializeGetCheckoutsList();
  }

  private initializeGetCheckoutsList() {
    if (this.accountId && this.authToken) {
      this.getCheckoutsList = makeGetCheckoutsList({
        authToken: this.authToken,
        service: new CheckoutService(),
        apiOrigin: this.apiOrigin,
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
      <checkouts-list-core
        getCheckoutsList={this.getCheckoutsList}
        onError-event={this.handleErrorEvent}
      />
    );
  }
}
