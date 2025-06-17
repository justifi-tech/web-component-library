import { Component, Element, Event, EventEmitter, h, Host, Method, Prop } from "@stencil/core";
import checkoutStore from "../../store/checkout.store";
import JustifiAnalytics from "../../api/Analytics";
import { checkPkgVersion } from "../../utils/check-pkg-version";
import { ComponentErrorCodes, ComponentErrorSeverity } from "../../api";
import { makeCheckoutComplete, makeGetCheckout } from "../../actions/checkout/checkout-actions";
import { CheckoutService } from "../../api/services/checkout.service";
import { IBillingInfo } from "../../api/BillingInformation";
import { IApplePayToken } from "../../api/ApplePay";

@Component({
  tag: 'justifi-modular-checkout',
  shadow: false
})
export class CheckoutWrapper {
  analytics: JustifiAnalytics;
  private observer?: MutationObserver;
  private paymentMethodFormRef?: HTMLJustifiCardFormElement | HTMLJustifiBankAccountFormElement;
  private billingInformationFormRef?: HTMLJustifiBillingInformationFormElement | HTMLJustifiPostalCodeFormElement;
  private insuranceFormRef?: HTMLJustifiSeasonInterruptionInsuranceElement;
  private sezzlePaymentMethodRef?: HTMLJustifiSezzlePaymentMethodElement;
  private applePayRef?: HTMLJustifiApplePayElement;
  private getCheckout: Function;
  private completeCheckout: Function;
  private applePayToken?: IApplePayToken;

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
      this.setupApplePayListeners(); // set up again listeners when DOM changes
    });

    this.observer.observe(this.hostEl, {
      childList: true,
      subtree: true
    });

    checkoutStore.checkoutId = this.checkoutId;

    const config = {
      authToken: this.authToken,
      checkoutId: this.checkoutId,
      service: new CheckoutService()
    }

    this.getCheckout = makeGetCheckout(config);
    this.completeCheckout = makeCheckoutComplete(config);
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
    this.setupApplePayListeners();
  }

  disconnectedCallback() {
    this.observer?.disconnect();
    this.removeApplePayListeners();
  }

  private fetchCheckout() {
    if (this.getCheckout) {
      this.getCheckout({
        onSuccess: ({ checkout }) => {
          checkoutStore.paymentMethods = checkout.payment_methods;
          checkoutStore.paymentMethodGroupId = checkout.payment_method_group_id;
          checkoutStore.paymentDescription = checkout.payment_description;
          checkoutStore.totalAmount = checkout.total_amount;
          checkoutStore.paymentAmount = checkout.payment_amount;
          checkoutStore.paymentCurrency = checkout.currency || 'USD';
          checkoutStore.bnplEnabled = checkout.payment_settings.bnpl_payments;
          checkoutStore.bnplProviderClientId = checkout?.bnpl?.provider_client_id;
          checkoutStore.bnplProviderMode = checkout?.bnpl?.provider_mode;
          checkoutStore.bnplProviderApiVersion = checkout?.bnpl?.provider_api_version;
          checkoutStore.bnplProviderCheckoutUrl = checkout?.bnpl?.provider_checkout_url;
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
    this.insuranceFormRef = this.hostEl.querySelector('justifi-season-interruption-insurance');
    this.sezzlePaymentMethodRef = this.hostEl.querySelector('justifi-sezzle-payment-method');
    this.applePayRef = this.hostEl.querySelector('justifi-apple-pay');
  }

  private setupApplePayListeners() {
    if (this.applePayRef) {
      this.applePayRef.addEventListener('applePayCompleted', this.handleApplePayCompleted);
      this.applePayRef.addEventListener('applePayError', this.handleApplePayError);
      this.applePayRef.addEventListener('applePayCancelled', this.handleApplePayCancelled);
    }
  }

  private removeApplePayListeners() {
    if (this.applePayRef) {
      this.applePayRef.removeEventListener('applePayCompleted', this.handleApplePayCompleted);
      this.applePayRef.removeEventListener('applePayError', this.handleApplePayError);
      this.applePayRef.removeEventListener('applePayCancelled', this.handleApplePayCancelled);
    }
  }

  private handleApplePayCompleted = (event: CustomEvent) => {
    const { success, token, error } = event.detail;
    
    if (success && token) {
      this.applePayToken = token;
      // Complete the checkout with Apple Pay token
      this.submitCheckoutWithApplePay();
    } else {
      console.error('Apple Pay completed but failed:', error);
      this.errorEvent.emit({
        message: error?.message || 'Apple Pay payment failed',
        errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  };

  private handleApplePayError = (event: CustomEvent) => {
    const { error } = event.detail;
    console.error('Apple Pay error:', error);
    this.errorEvent.emit({
      message: error || 'Apple Pay error occurred',
      errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
      severity: ComponentErrorSeverity.ERROR,
    });
  };

  private handleApplePayCancelled = () => {
    console.log('Apple Pay cancelled by user');
    // Reset the token if cancelled
    this.applePayToken = undefined;
  };

  private async submitCheckoutWithApplePay(): Promise<void> {
    if (!this.applePayToken) {
      this.errorEvent.emit({
        message: 'No Apple Pay token available',
        errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
        severity: ComponentErrorSeverity.ERROR,
      });
      return;
    }

    const payment = {
      payment_mode: 'apple_pay',
      payment_token: this.applePayToken,
    };

    this.completeCheckout({
      payment,
      onSuccess: ({ checkout }) => {
        this.checkoutComplete.emit({
          checkout,
          message: 'Apple Pay checkout completed successfully',
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

  private async tokenizePaymentMethod(tokenizeArgs: IBillingInfo): Promise<any> {
    const billingInfoValues = await this.billingInformationFormRef?.getValues() ?? {};

    const combinedBillingInfo = { ...tokenizeArgs, ...billingInfoValues };

    const paymentMethodMetadata = {
      accountId: this.accountId,
      payment_method_group_id: undefined,
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

  private async getPaymentMethod(submitCheckoutArgs: IBillingInfo): Promise<string | undefined> {
    // If Apple Pay token is available, return a placeholder since we handle it differently
    if (this.applePayToken) {
      return 'apple_pay_token';
    }

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
    // If Apple Pay token is available, validation is already complete
    if (this.applePayToken) {
      return true;
    }

    const promises = [
      this.paymentMethodFormRef?.validate(),
      this.billingInformationFormRef?.validate()
    ];

    if (this.insuranceFormRef) {
      promises.push(this.insuranceFormRef.validate());
    }

    const validationResults = await Promise.all(promises);

    return validationResults.every(result => result?.isValid !== false);
  }

  @Method()
  async submitCheckout(submitCheckoutArgs?: IBillingInfo): Promise<void> {
    // If Apple Pay token is available, use Apple Pay flow
    if (this.applePayToken) {
      await this.submitCheckoutWithApplePay();
      return;
    }

    const isValid = await this.validate();
    if (!isValid) {
      this.errorEvent.emit({
        message: 'Please fill in all required fields.',
        errorCode: ComponentErrorCodes.VALIDATION_ERROR,
        severity: ComponentErrorSeverity.ERROR,
      });
      return;
    }

    let payment: { payment_mode: string; payment_token: string | undefined };

    if (checkoutStore.selectedPaymentMethod === 'sezzle') {
      const insuranceValidation = this.insuranceFormRef ? await this.insuranceFormRef.validate() : { isValid: true };
      const sezzleResult = await this.sezzlePaymentMethodRef.resolvePaymentMethod(insuranceValidation);
      if (sezzleResult.error) {
        this.errorEvent.emit({
          message: sezzleResult.error.message,
          errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
          severity: ComponentErrorSeverity.ERROR,
        });
        return;
      } else if (sezzleResult.bnpl?.status === 'success') {
        payment = {
          payment_mode: 'bnpl',
          payment_token: undefined,
        };
      }
    } else {
      const paymentMethod = await this.getPaymentMethod(submitCheckoutArgs);
      if (!paymentMethod) {
        this.errorEvent.emit({
          message: 'Payment method tokenization failed.',
          errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
          severity: ComponentErrorSeverity.ERROR,
        });
        return;
      };
      payment = {
        payment_mode: 'ecom',
        payment_token: paymentMethod,
      };
    }


    this.completeCheckout({
      payment,
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