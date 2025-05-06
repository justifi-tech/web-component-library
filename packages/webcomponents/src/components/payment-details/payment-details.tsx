import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { PaymentService } from '../../api/services/payment.service';
import { makeGetPaymentDetails } from '../../actions/payment/get-payment-details';
import { ErrorState } from '../../ui-components/details/utils';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import JustifiAnalytics from '../../api/Analytics';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { ComponentErrorEvent } from '../../api/ComponentEvents';

@Component({
  tag: 'justifi-payment-details',
  shadow: true,
})

export class PaymentDetails {
  @Prop() paymentId: string;
  @Prop() authToken: string;
  
  @State() getPaymentDetails: Function;
  @State() errorMessage: string = null;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;

  analytics: JustifiAnalytics;

  componentWillLoad() {
    checkPkgVersion();
    this.analytics = new JustifiAnalytics(this);
    this.initializeGetPaymentDetails();
  }

  disconnectedCallback() {
    this.analytics.cleanup();
  };

  @Watch('paymentId')
  @Watch('authToken')
  propChanged() {
    this.initializeGetPaymentDetails();
  }

  private initializeGetPaymentDetails() {
    if (this.paymentId && this.authToken) {
      this.getPaymentDetails = makeGetPaymentDetails({
        id: this.paymentId,
        authToken: this.authToken,
        service: new PaymentService()
      });
    } else {
      this.errorMessage = 'Payment ID and Auth Token are required';
      this.errorEvent.emit({
        message: this.errorMessage,
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  }

  paymentService = new PaymentService();

  handleErrorEvent = event => {
    this.errorMessage = event.detail.message;
    this.errorEvent.emit(event.detail);
  }

  render() {
    if (this.errorMessage) {
      return ErrorState(this.errorMessage);
    }

    return (
      <payment-details-core
        getPaymentDetails={this.getPaymentDetails}
        onError-event={this.handleErrorEvent}
      ></payment-details-core>
    );
  }
}
