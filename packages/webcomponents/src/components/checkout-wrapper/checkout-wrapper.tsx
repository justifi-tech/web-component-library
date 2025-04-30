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
  private paymentMethodFormRef?: HTMLJustifiCardFormElement | HTMLJustifiBankAccountFormElement;
  private billingInfomationFormRef?: HTMLJustifiBillingInformationFormElement | HTMLJustifiPostalCodeFormElement;

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
    this.paymentMethodFormRef = this.hostEl.querySelector('justifi-card-form') || this.hostEl.querySelector('justifi-bank-account-form');
    this.billingInfomationFormRef = this.hostEl.querySelector('justifi-billing-information-form') || this.hostEl.querySelector('justifi-postal-code-form');
  }

  @Method()
  async validate(): Promise<boolean> {
    if (this.paymentMethodFormRef) {
      let billingValidation = { isValid: true };
      if (this.billingInfomationFormRef) {
        console.log('billingInfomationFormRef', this.billingInfomationFormRef);
        billingValidation = { isValid: false };
        billingValidation = await this.billingInfomationFormRef.validate();
      }
      const paymentMethodValidation = await this.paymentMethodFormRef.validate();
      return !!billingValidation?.isValid && !!paymentMethodValidation?.isValid;
    } else {
      this.errorEvent.emit({
        message: "Component not found: 'justifi-card-form' or 'justifi-bank-account-form' is required for validation.",
        errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  }

  @Method()
  async tokenizePaymentMethod(billingInfo: BillingInfo): Promise<any> {
    if (this.paymentMethodFormRef) {
      const isValid = await this.validate();

      if (!isValid) {
        console.error('Form is not valid');
        throw new Error('Form is not valid');
      }

      if (this.billingInfomationFormRef) {
        const billingInfoValues = await this.billingInfomationFormRef.getValues();
        billingInfo = { ...billingInfo, ...billingInfoValues } as BillingInfo;
      }

      return this.paymentMethodFormRef.tokenize({
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

