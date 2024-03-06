import { Component, Prop, h, State, Watch } from '@stencil/core';
import { makeGetCheckout } from './get-checkout';
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
    } else {
      this.errorMessage = 'Client ID is required';
    }
  }

  @Watch('authToken')
  @Watch('checkoutId')
  propChanged() {
    this.initializeGetCheckout();
  }

  render() {
    return (
      <justifi-checkout-core getCheckout={this.getCheckout}></justifi-checkout-core>
    );
  }
}
