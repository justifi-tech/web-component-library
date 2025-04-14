import { Component, Element, h, Method, Prop } from "@stencil/core";
import checkoutStore from "../../store/checkout.store";
import JustifiAnalytics from "../../api/Analytics";
import { checkPkgVersion } from "../../utils/check-pkg-version";

@Component({
  tag: 'justifi-checkout-wrapper',
  shadow: false
})
export class CheckoutWrapper {
  @Prop() authToken: string;
  @Prop() accountId: string;

  @Element() hostEl: HTMLElement;

  private cardFormRef?: HTMLJustifiCardFormElement;

  analytics: JustifiAnalytics;

  componentWillLoad() {
    this.analytics = new JustifiAnalytics(this);
    checkPkgVersion();
    checkoutStore.authToken = this.authToken;
    checkoutStore.accountId = this.accountId;
  }

  componentDidLoad() {
    this.cardFormRef = this.hostEl.querySelector('justifi-card-form');

    if (this.cardFormRef) {
      console.log('Card form loaded!', this.cardFormRef);
    }
  }

  @Method()
  async validate(): Promise<boolean> {
    if (this.cardFormRef) {
      return this.cardFormRef.validate();
    } else {
      throw new Error('CardForm component not found');
    }
  }

  @Method()
  async tokenizePaymentMethod({ addressPostalCode }: { addressPostalCode?: number }): Promise<any> {
    if (this.cardFormRef) {
      const isValid = await this.cardFormRef.validate();
      if (!isValid) {
        throw new Error('Card form is not valid');
      }
      return this.cardFormRef.tokenize({
        clientId: this.authToken,
        paymentMethodMetadata: {
          accountId: this.accountId,
          address_postal_code: addressPostalCode
        },
        account: this.accountId,
      });
    } else {
      throw new Error('CardForm component not found');
    }
  }

  render() {
    return (
      <slot></slot>
    );
  }
}

