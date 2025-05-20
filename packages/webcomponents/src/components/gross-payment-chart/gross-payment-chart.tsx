import { Component, Event, EventEmitter, Prop, State, Watch, h } from '@stencil/core';
import { ReportsService } from '../../api/services/reports.service';
import { makeGetGrossPaymentChartData } from '../../actions/gross-payment/get-gross-payment-chart-data';
import { ErrorState } from '../../ui-components/details/utils';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import JustifiAnalytics from '../../api/Analytics';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { ComponentErrorEvent } from '../../api/ComponentEvents';

@Component({
  tag: 'justifi-gross-payment-chart',
  shadow: true,
})
export class GrossPaymentChart {
  @Prop() accountId: string;
  @Prop() authToken: string;

  @State() getGrossPayment: Function;
  @State() errorMessage: string = null;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;

  analytics: JustifiAnalytics;

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.initializeGetGrossPayment();
  }

  disconnectedCallback() {
    this.analytics && this.analytics.cleanup();
  };

  @Watch('accountId')
  @Watch('authToken')
  propChanged() {
    this.initializeGetGrossPayment();
  }

  private initializeGetGrossPayment() {
    if (this.accountId && this.authToken) {
      this.getGrossPayment = makeGetGrossPaymentChartData({
        id: this.accountId,
        authToken: this.authToken,
        service: new ReportsService(),
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

  handleErrorEvent = (event: CustomEvent<ComponentErrorEvent>) => {
    this.errorMessage = event.detail.message;
    this.errorEvent.emit(event.detail);
  };

  render() {
    if (this.errorMessage) {
      return ErrorState(this.errorMessage);
    }

    return (
      <gross-payment-chart-core getGrossPayment={this.getGrossPayment} onError-event={this.handleErrorEvent} />
    );
  }
}


