import { Component, Event, EventEmitter, Prop, State, Watch, h } from '@stencil/core';
import { ReportsService } from '../../api/services/reports.service';
import { makeGetGrossPaymentChartData } from './get-gross-payment-chart-data';
import { ErrorState } from '../details/utils';
import { ComponentError, ComponentErrorCodes } from '../../api/ComponentError';

@Component({
  tag: 'justifi-gross-payment-chart',
  shadow: true,
})
export class GrossPaymentChart {
  @Prop() accountId: string;
  @Prop() authToken: string;

  @State() getGrossPayment: Function;
  @State() errorMessage: string = null;

  @Event() errorEvent: EventEmitter<ComponentError>;

  componentWillLoad() {
    this.initializeGetGrossPayment();
  }

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
      <gross-payment-chart-core getGrossPayment={this.getGrossPayment} onErrorEvent={this.handleErrorEvent} />
    );
  }
}


