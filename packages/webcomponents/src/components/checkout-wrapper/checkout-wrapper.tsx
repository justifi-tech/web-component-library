import { Component, Element, Event, EventEmitter, h, Method, Prop } from "@stencil/core";
import checkoutStore from "../../store/checkout.store";
import JustifiAnalytics from "../../api/Analytics";
import { checkPkgVersion } from "../../utils/check-pkg-version";
import { ComponentErrorCodes, ComponentErrorSeverity } from "../../api";
import { BillingInfo } from "../../api/BillingInformation";

@Component({
  tag: 'justifi-checkout-wrapper',
  shadow: false
})
export class CheckoutWrapper {
  analytics: JustifiAnalytics;
  private observer?: MutationObserver;
  private cardFormRef?: HTMLJustifiCardFormElement;
  private bankAccountFormRef?: HTMLJustifiBankAccountFormElement;

  @Prop() authToken: string;
  @Prop() accountId: string;

  @Element() hostEl: HTMLElement;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter;

  componentWillLoad() {
    this.analytics = new JustifiAnalytics(this);
    checkPkgVersion();
    checkoutStore.authToken = this.authToken;
    checkoutStore.accountId = this.accountId;
  }

  connectedCallback() {
    this.observer = new MutationObserver(() => {
      this.queryFormRefs();
    });

    this.observer.observe(this.hostEl, {
      childList: true,
      subtree: true
    });
  }

  componentDidLoad() {
    this.queryFormRefs();
  }

  private queryFormRefs() {
    this.cardFormRef = this.hostEl.querySelector('justifi-card-form');
    this.bankAccountFormRef = this.hostEl.querySelector('justifi-bank-account-form');
  }

  @Method()
  async validate(): Promise<boolean> {
    if (this.cardFormRef || this.bankAccountFormRef) {
      const formToValidate = this.cardFormRef || this.bankAccountFormRef;
      return formToValidate.validate();
    } else {
      throw new Error('CardForm component not found');
    }
  }

  @Method()
  async tokenizePaymentMethod(billingInfo: BillingInfo): Promise<any> {
    if (this.cardFormRef || this.bankAccountFormRef) {
      const formToTokenize = this.cardFormRef || this.bankAccountFormRef;
      const isValid = await formToTokenize.validate();
      if (!isValid) {
        throw new Error('Card form is not valid');
      }
      return formToTokenize.tokenize({
        clientId: this.authToken,
        paymentMethodMetadata: {
          accountId: this.accountId,
          ...billingInfo
        },
        account: this.accountId,
      });
    } else {
      this.errorEvent.emit({
        message: "Component not found: 'justifi-card-form' or 'justifi-bank-account-form' is required for tokenization.",
        errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  }

  @Method()
  async submitCheckout(billingInfo: BillingInfo): Promise<any> {
    try {
      const tokenizeResponse = await this.tokenizePaymentMethod(billingInfo);
      if (tokenizeResponse.error) {
        this.errorEvent.emit({
          errorCode: (tokenizeResponse.error.code as ComponentErrorCodes),
          message: tokenizeResponse.error.message,
          severity: ComponentErrorSeverity.ERROR,
        });
      }
      return tokenizeResponse;
    } catch (error) {
      this.errorEvent.emit({
        message: error.message,
        errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  }

  render() {
    return (
      <slot></slot>
    );
  }
}

