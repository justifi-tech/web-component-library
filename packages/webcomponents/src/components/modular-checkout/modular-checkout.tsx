import { Component, Element, Event, EventEmitter, h, Host, Method, Prop } from "@stencil/core";
import { checkoutStore } from "../../store/checkout.store";
import JustifiAnalytics from "../../api/Analytics";
import { checkPkgVersion } from "../../utils/check-pkg-version";
import { ComponentErrorCodes, ComponentErrorSeverity } from "../../api";
import { makeCheckoutComplete, makeGetCheckout } from "../../actions/checkout/checkout-actions";
import { CheckoutService } from "../../api/services/checkout.service";
import { BillingFormFields } from "../../components";

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
  private getCheckout: Function;
  private completeCheckout: Function;

  @Prop() authToken: string;
  @Prop() checkoutId: string;
  @Prop() savePaymentMethod?: boolean = false;

  @Element() hostEl: HTMLElement;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter;
  @Event({ eventName: 'submit-event' }) submitEvent: EventEmitter;

  connectedCallback() {
    this.observer = new MutationObserver(() => {
      this.queryFormRefs();
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
          checkoutStore.accountId = checkout.account_id;
          checkoutStore.paymentMethods = checkout.payment_methods;
          checkoutStore.paymentMethodGroupId = checkout.payment_method_group_id;
          checkoutStore.paymentDescription = checkout.payment_description;
          checkoutStore.totalAmount = checkout.total_amount;
          checkoutStore.paymentAmount = checkout.payment_amount;
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
  }

  private async tokenizePaymentMethod(tokenizeArgs: BillingFormFields): Promise<any> {
    const billingInfoValues = await this.billingInformationFormRef?.getValues() ?? {};

    const combinedBillingInfo = { ...tokenizeArgs, ...billingInfoValues };

    const paymentMethodMetadata = {
      accountId: checkoutStore.accountId,
      payment_method_group_id: undefined,
      ...combinedBillingInfo
    };

    if (this.savePaymentMethod) {
      paymentMethodMetadata.payment_method_group_id = checkoutStore.paymentMethodGroupId;
    }

    return this.paymentMethodFormRef.tokenize({
      clientId: this.authToken,
      paymentMethodMetadata,
      account: checkoutStore.accountId,
    });
  }

  private async getPaymentMethod(submitCheckoutArgs: BillingFormFields): Promise<string | undefined> {
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
  async submitCheckout(submitCheckoutArgs?: BillingFormFields): Promise<void> {
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
        this.submitEvent.emit({
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
