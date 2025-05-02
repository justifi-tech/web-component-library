import { Component, Element, Event, EventEmitter, h, Host, Method, Prop } from "@stencil/core";
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
  private paymentMethodFormRef?: HTMLJustifiCardFormElement | HTMLJustifiBankAccountFormElement;
  private billingInformationFormRef?: HTMLJustifiBillingInformationFormElement | HTMLJustifiPostalCodeFormElement;

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

  disconnectedCallback() {
    this.observer?.disconnect();
  }

  private queryFormRefs() {
    this.paymentMethodFormRef = this.hostEl.querySelector('justifi-card-form, justifi-bank-account-form');
    this.billingInformationFormRef = this.hostEl.querySelector('justifi-billing-information-form, justifi-postal-code-form');
  }

  @Method()
  async validate(): Promise<boolean> {
    const validationResults = await Promise.all([
      this.paymentMethodFormRef?.validate(),
      this.billingInformationFormRef?.validate()
    ]);

    return validationResults.every(result => result?.isValid !== false);
  }

  @Method()
  async tokenizePaymentMethod(billingInfo: BillingInfo): Promise<any> {
    if (!this.paymentMethodFormRef) {
      return this.errorEvent.emit({
        message: 'Payment method form not found',
        errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
        severity: ComponentErrorSeverity.ERROR,
      });
    }

    const isValid = await this.validate();
    if (!isValid) return;

    const billingInfoValues = await this.billingInformationFormRef?.getValues() ?? {};

    const combinedBillingInfo = { ...billingInfo, ...billingInfoValues };

    return this.paymentMethodFormRef.tokenize({
      clientId: this.authToken,
      paymentMethodMetadata: {
        accountId: this.accountId,
        ...combinedBillingInfo
      },
      account: this.accountId,
    });
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
      <Host></Host>
    );
  }
}

