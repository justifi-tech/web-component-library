import { Component, Element, Event, EventEmitter, h, Host, Method, Prop } from "@stencil/core";
import checkoutStore from "../../store/checkout.store";
import JustifiAnalytics from "../../api/Analytics";
import { checkPkgVersion } from "../../utils/check-pkg-version";
import { ComponentErrorCodes, ComponentErrorSeverity } from "../../api";
import { makeCheckoutComplete, makeGetCheckout } from "../../actions/checkout/checkout-actions";
import { CheckoutService } from "../../api/services/checkout.service";
import { ISubmitCheckout } from "../../api/PaymentMethod";

@Component({
  tag: 'justifi-checkout-wrapper',
  shadow: false
})
export class CheckoutWrapper {
  analytics: JustifiAnalytics;
  private observer?: MutationObserver;
  private paymentMethodFormRef?: HTMLJustifiCardFormElement | HTMLJustifiBankAccountFormElement;
  private billingInformationFormRef?: HTMLJustifiBillingInformationFormElement | HTMLJustifiPostalCodeFormElement;
  private getCheckout: Function;
  private completeCheckout: Function;

  @Prop() authToken: string;
  @Prop() accountId: string;
  @Prop() checkoutId: string;
  @Prop() savePaymentMethod?: boolean = false;

  @Element() hostEl: HTMLElement;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter;
  @Event({ eventName: 'checkout-complete-event' }) checkoutComplete: EventEmitter;

  connectedCallback() {
    this.observer = new MutationObserver(() => {
      this.queryFormRefs();
    });

    this.observer.observe(this.hostEl, {
      childList: true,
      subtree: true
    });

    this.getCheckout = makeGetCheckout({
      authToken: this.authToken,
      checkoutId: this.checkoutId,
      service: new CheckoutService()
    });

    this.completeCheckout = makeCheckoutComplete({
      authToken: this.authToken,
      checkoutId: this.checkoutId,
      service: new CheckoutService()
    });
  }

  componentWillLoad() {
    this.analytics = new JustifiAnalytics(this);
    checkPkgVersion();
    checkoutStore.authToken = this.authToken;
    checkoutStore.accountId = this.accountId;
    this.fetchCheckout();
  }

  componentDidLoad() {
    this.queryFormRefs();
  }

  disconnectedCallback() {
    this.observer?.disconnect();
  }

  private fetchCheckout() {
    if (this.getCheckout) {
      this.getCheckout({
        onSuccess: ({ checkout }) => {
          checkoutStore.paymentMethods = checkout.payment_methods;
          checkoutStore.paymentMethodGroupId = checkout.payment_method_group_id;
          checkoutStore.paymentDescription = checkout.payment_description;
          checkoutStore.totalAmount = checkout.total_amount;
        },
        onError: (error) => {
          this.errorEvent.emit({
            message: error.message,
            errorCode: ComponentErrorCodes.FETCH_ERROR,
            severity: ComponentErrorSeverity.ERROR,
          });
        }
      });
    }
  }

  private queryFormRefs() {
    this.paymentMethodFormRef = this.hostEl.querySelector('justifi-card-form, justifi-bank-account-form');
    this.billingInformationFormRef = this.hostEl.querySelector('justifi-billing-information-form, justifi-postal-code-form');
  }

  private async getPaymentMethod(submitCheckoutArgs: ISubmitCheckout): Promise<string | undefined> {
    if (!this.paymentMethodFormRef) {
      return checkoutStore.selectedPaymentMethod;
    }

    const { error, id: token } = await this.tokenizePaymentMethod(submitCheckoutArgs);

    if (error) {
      this.errorEvent.emit({
        errorCode: error.code as ComponentErrorCodes,
        message: error.message,
        severity: ComponentErrorSeverity.ERROR,
      });
      return undefined;
    }

    return token;
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
  async tokenizePaymentMethod(tokenizeArgs: ISubmitCheckout): Promise<any> {
    const isValid = await this.validate();
    if (!isValid) return;

    const billingInfoValues = await this.billingInformationFormRef?.getValues() ?? {};

    const combinedBillingInfo = { ...tokenizeArgs, ...billingInfoValues };

    const paymentMethodMetadata = {
      accountId: this.accountId,
      ...combinedBillingInfo
    };

    if (this.savePaymentMethod) {
      paymentMethodMetadata.payment_method_group_id = checkoutStore.paymentMethodGroupId;
    }

    return this.paymentMethodFormRef.tokenize({
      clientId: this.authToken,
      paymentMethodMetadata,
      account: this.accountId,
    });
  }

  @Method()
  async submitCheckout(submitCheckoutArgs: ISubmitCheckout): Promise<void> {
    const paymentMethod = await this.getPaymentMethod(submitCheckoutArgs);

    if (!paymentMethod) return;

    this.completeCheckout({
      payment: {
        payment_mode: 'ecom',
        payment_token: paymentMethod,
      },
      onSuccess: ({ checkout }) => {
        this.checkoutComplete.emit({
          checkout,
          message: 'Checkout completed successfully',
        });
      },
      onError: (error) => {
        this.errorEvent.emit({
          message: error.message,
          errorCode: ComponentErrorCodes.COMPLETE_CHECKOUT_ERROR,
          severity: ComponentErrorSeverity.ERROR,
        });
      },
    });
  }

  render() {
    return (
      <Host>
      </Host>
    );
  }
}

