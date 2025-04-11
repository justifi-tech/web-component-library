import { Component, Element, h, Method, Prop } from "@stencil/core";
import checkoutStore from "../../store/checkout.store";

@Component({
  tag: 'justifi-checkout-wrapper',
  shadow: false
})
export class CheckoutWrapper {
  @Prop() authToken: string;
  @Prop() accountId: string;

  @Element() hostEl: HTMLElement;

  private tokenizePaymentMethodRef?: HTMLJustifiTokenizePaymentMethodElement;


  componentWillLoad() {
    checkoutStore.authToken = this.authToken;
    checkoutStore.accountId = this.accountId;
  }

  componentDidLoad() {
    this.tokenizePaymentMethodRef = this.hostEl.querySelector('justifi-tokenize-payment-method');

    if (this.tokenizePaymentMethodRef) {
      console.log('Tokenize component loaded!', this.tokenizePaymentMethodRef);
    }
  }

  @Method()
  async tokenizePaymentMethod(event?: CustomEvent): Promise<any> {
    event && event.preventDefault();
    if (this.tokenizePaymentMethodRef) {
      return this.tokenizePaymentMethodRef.tokenizePaymentMethod(event);
    } else {
      throw new Error('TokenizePaymentMethod component not found');
    }
  }

  render() {
    return (
      <slot></slot>
    );
  }
}

