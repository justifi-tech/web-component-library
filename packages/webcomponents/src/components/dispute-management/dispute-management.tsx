import { Component, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import JustifiAnalytics from '../../api/Analytics';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { makeGetDispute } from '../../actions/dispute/dispute-actions';
import { DisputeService } from '../../api/services/dispute.service';
import { config } from '../../../config';
import { ComponentErrorEvent } from '../../api/ComponentEvents';

@Component({
  tag: 'justifi-dispute-management',
})
export class DisputeManagement {
  @Prop() disputeId: string;
  @Prop() authToken: string;
  @Prop() apiOrigin?: string = config.proxyApiOrigin;

  @State() getDispute: Function;
  @State() errorMessage: string = null;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;

  analytics: JustifiAnalytics;

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.initializeGetDispute();
  }

  disconnectedCallback() {
    this.analytics.cleanup();
  };

  @Watch('disputeId')
  @Watch('authToken')
  propChanged() {
    this.initializeGetDispute();
  }

  private initializeGetDispute() {
    if (this.disputeId && this.authToken) {
      this.getDispute = makeGetDispute({
        id: this.disputeId,
        authToken: this.authToken,
        service: new DisputeService(),
        apiOrigin: this.apiOrigin,
      });
    } else {
      this.errorMessage = 'Dispute ID and Auth Token are required';
      this.errorEvent.emit({
        message: this.errorMessage,
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  }

  handleErrorEvent = event => {
    this.errorMessage = event.detail.message;
    this.errorEvent.emit(event.detail);
  }

  render() {
    return (
      <justifi-dispute-management-core
        getDispute={this.getDispute}
        disputeId={this.disputeId}
        authToken={this.authToken}
        onError-event={this.handleErrorEvent}
      />
    );
  }
}
