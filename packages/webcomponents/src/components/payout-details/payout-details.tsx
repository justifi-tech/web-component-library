import { Component, h, Prop, Watch, State, Event, EventEmitter } from '@stencil/core';
import { PayoutService } from '../../api/services/payout.service';
import { makeGetPayoutDetails } from './get-payout-details';
import { ErrorState } from '../../ui-components/details/utils';
import { ComponentError, ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import JustifiAnalytics from '../../api/Analytics';
import { makeGetPayoutCSV } from './get-payout-csv';
import { checkPkgVersion } from '../../utils/check-pkg-version';

/**
  * @exportedPart detail-loading-spinner
  * @exportedPart detail-loading-state
  * 
  * @exportedPart detail-head
  * @exportedPart detail-head-info
  * @exportedPart detail-head-info-item
  * @exportedPart detail-head-info-item-title
  * @exportedPart detail-head-info-item-data
  * @exportedPart detail-head-badge
  * 
  * @exportedPart header-2
  * 
  * @exportedPart detail-empty-state
  * @exportedPart detail-info
  * @exportedPart detail-info-item
  * @exportedPart detail-info-item-title
  * @exportedPart detail-info-item-data
  * @exportedPart detail-metadata
  * @exportedPart detail-section
  * @exportedPart detail-section-item-title
  * @exportedPart detail-section-item-data
*/
@Component({
  tag: 'justifi-payout-details',
  shadow: true,
})

export class PayoutDetails {
  @Prop() payoutId: string;
  @Prop() authToken: string;

  @State() getPayout: Function;
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

  @Watch('payoutId')
  @Watch('authToken')
  propChanged() {
    this.initializeServices();
  }

  initializeServices() {
    if (this.payoutId && this.authToken) {
      this.getPayout = makeGetPayoutDetails({
        id: this.payoutId,
        authToken: this.authToken,
        service: new PayoutService()
      });
      this.getPayoutCSV = makeGetPayoutCSV({
        authToken: this.authToken,
        service: new PayoutService()
      });
    } else {
      this.errorMessage = 'Failed to load payout details. payoutId or authToken is not provided.';
      this.errorEvent.emit({
        message: this.errorMessage,
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        severity: ComponentErrorSeverity.ERROR
      });
    }
  }

  handleErrorEvent = (event: CustomEvent<ComponentError>) => {
    this.errorMessage = event.detail.message;
    this.errorEvent.emit(event.detail);
  };

  render() {
    if (this.errorMessage) {
      return ErrorState(this.errorMessage);
    }

    return (
      <payout-details-core
        getPayout={this.getPayout}
        getPayoutCSV={this.getPayoutCSV}
        onError-event={this.handleErrorEvent}
      />
    );
  }
}
