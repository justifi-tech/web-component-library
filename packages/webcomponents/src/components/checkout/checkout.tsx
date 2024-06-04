import { Component, Prop, h, State, Watch, Event, EventEmitter } from '@stencil/core';
import { makeGetCheckout, makeCheckoutComplete } from './checkout-actions';
import { CheckoutService } from '../../api/services/checkout.service';
import { ComponentError, ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';

@Component({
  tag: 'justifi-checkout',
  shadow: true,
})
export class Checkout {
  @Prop() iframeOrigin?: string;
  @Prop() authToken: string;
  @Prop() checkoutId: string;

  @State() getCheckout: Function;
  @State() complete: Function;
  @State() errorMessage: string = '';

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;

  componentWillLoad() {
    this.initializeGetCheckout();
  }

  private initializeGetCheckout() {
    if (this.authToken && this.checkoutId) {
      this.getCheckout = makeGetCheckout({
        authToken: this.authToken,
        checkoutId: this.checkoutId,
        service: new CheckoutService()
      });
      this.complete = makeCheckoutComplete({
        authToken: this.authToken,
        checkoutId: this.checkoutId,
        service: new CheckoutService()
      });
    } else {
      this.errorEvent.emit({
        message: 'auth-token and checkout-id are required',
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  }

  @Watch('authToken')
  @Watch('checkoutId')
  propChanged() {
    this.initializeGetCheckout();
  }

  render() {
    return (
      <justifi-checkout-core
        getCheckout={this.getCheckout}
        complete={this.complete}
      >
        <div slot="insurance" style={{ 'width': '100%' }}>
          <slot name="insurance" />
        </div>
      </justifi-checkout-core>
    );
  }
}
