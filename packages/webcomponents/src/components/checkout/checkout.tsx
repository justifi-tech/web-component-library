import { Component, Prop, h, State, Watch } from '@stencil/core';
import { makeGetCheckout, makeCheckoutComplete } from './checkout-actions';
import { CheckoutService } from '../../api/services/checkout.service';

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
      this.errorMessage = 'auth-token and checkout-id are required';
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
      ></justifi-checkout-core>
    );
  }
}
