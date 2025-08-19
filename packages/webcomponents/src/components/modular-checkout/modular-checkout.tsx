import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, Watch } from "@stencil/core";
import { checkoutStore, onChange } from "../../store/checkout.store";
import JustifiAnalytics from "../../api/Analytics";
import { checkPkgVersion } from "../../utils/check-pkg-version";
import { ComponentErrorCodes, ComponentErrorMessages, ComponentErrorSeverity, ICheckout, ICheckoutStatus } from "../../api";
import { makeCheckoutComplete, makeGetCheckout } from "../../actions/checkout/checkout-actions";
import { CheckoutService } from "../../api/services/checkout.service";
import { BillingFormFields } from "../../components";
import { insuranceValues, insuranceValuesOn, hasInsuranceValueChanged } from "../insurance/insurance-state";

@Component({
  tag: 'justifi-modular-checkout',
  shadow: false
})
export class ModularCheckout {
  analytics: JustifiAnalytics;
  private observer?: MutationObserver;
  private paymentMethodFormRef?: HTMLJustifiCardFormElement | HTMLJustifiBankAccountFormElement;
  private billingFormRef?: HTMLJustifiBillingFormElement | HTMLJustifiBankAccountBillingFormSimpleElement | HTMLJustifiCardBillingFormSimpleElement;
  private insuranceFormRef?: HTMLJustifiSeasonInterruptionInsuranceElement;
  private sezzlePaymentMethodRef?: HTMLJustifiSezzlePaymentMethodElement;
  private plaidPaymentMethodRef?: any; // Will be properly typed after build
  private getCheckout: Function;
  private completeCheckout: Function;

  @Prop() authToken: string;
  @Prop() checkoutId: string;
  @Prop() savePaymentMethod?: boolean = false;

  @Element() hostEl: HTMLElement;

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter;
  @Event({ eventName: 'submit-event' }) submitEvent: EventEmitter;
  @Event({ eventName: 'payment-method-changed' }) paymentMethodChangedEvent: EventEmitter<string>;

  @Watch('savePaymentMethod')
  savePaymentMethodChanged(newValue: boolean) {
    checkoutStore.savePaymentMethod = newValue;
  }

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

    onChange('selectedPaymentMethod', (newValue: string) => {
      this.paymentMethodChangedEvent.emit(newValue);
    });
  }

  componentWillLoad() {
    if (!this.authToken || !this.checkoutId) {
      this.errorEvent.emit({
        message: ComponentErrorMessages.NOT_AUTHENTICATED,
        errorCode: ComponentErrorCodes.NOT_AUTHENTICATED,
        severity: ComponentErrorSeverity.ERROR,
      });
      return;
    }
    this.analytics = new JustifiAnalytics(this);
    checkPkgVersion();
    checkoutStore.authToken = this.authToken;
    checkoutStore.savePaymentMethod = this.savePaymentMethod;
    this.fetchCheckout();

    // Refresh the checkout data when insurance values actually change (not on initial load)
    insuranceValuesOn('set', (key: string) => {
      const value = insuranceValues[key];
      if (value !== undefined && hasInsuranceValueChanged(key, value)) {
        this.fetchCheckout();
      }
    });
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
          if (checkout.status === ICheckoutStatus.completed) {
            this.errorEvent.emit({
              message: ComponentErrorMessages.CHECKOUT_ALREADY_COMPLETED,
              errorCode: ComponentErrorCodes.CHECKOUT_ALREADY_COMPLETED,
              severity: ComponentErrorSeverity.ERROR,
            });
            return;
          } else if (checkout.status === ICheckoutStatus.expired) {
            this.errorEvent.emit({
              message: ComponentErrorMessages.CHECKOUT_EXPIRED,
              errorCode: ComponentErrorCodes.CHECKOUT_EXPIRED,
              severity: ComponentErrorSeverity.ERROR,
            });
            return;
          }

          this.updateStore(checkout);
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

  private updateStore(checkout: ICheckout) {
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
  }

  private queryFormRefs() {
    this.paymentMethodFormRef =
      this.hostEl.querySelector('justifi-card-form') ||
      this.hostEl.querySelector('justifi-bank-account-form');

    this.billingFormRef =
      this.hostEl.querySelector('justifi-billing-form-full') ||
      this.hostEl.querySelector('justifi-card-billing-form-simple') ||
      this.hostEl.querySelector('justifi-bank-account-billing-form-simple');

    this.insuranceFormRef = this.hostEl.querySelector('justifi-season-interruption-insurance');
    this.sezzlePaymentMethodRef = this.hostEl.querySelector('justifi-sezzle-payment-method');
    this.plaidPaymentMethodRef = this.hostEl.querySelector('justifi-plaid-payment-method');
  }

  private async tokenizePaymentMethod(tokenizeArgs: BillingFormFields): Promise<any> {
    const billingInfoValues = await this.billingFormRef?.getValues() ?? {};

    const combinedBillingInfo = { ...tokenizeArgs, ...billingInfoValues };

    const paymentMethodMetadata = {
      accountId: checkoutStore.accountId,
      payment_method_group_id: undefined,
      ...combinedBillingInfo
    };

    if (checkoutStore.savePaymentMethod) {
      paymentMethodMetadata.payment_method_group_id = checkoutStore.paymentMethodGroupId;
    }

    return this.paymentMethodFormRef?.tokenize({
      clientId: this.authToken,
      paymentMethodMetadata,
      account: checkoutStore.accountId,
    });
  }

  private async getPaymentMethod(submitCheckoutArgs: BillingFormFields): Promise<string | undefined> {
    // If we have a payment token from the store (set by tokenize-payment-method), use it
    if (checkoutStore.paymentToken) {
      return checkoutStore.paymentToken;
    }

    // Fallback to the original tokenization logic for backward compatibility
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
    console.log('billing information form', this.billingFormRef);
    console.log('payment method form', this.paymentMethodFormRef);
    console.log('insurance form', this.insuranceFormRef);
    console.log('sezzle payment method', this.sezzlePaymentMethodRef);
    console.log('plaid payment method', this.plaidPaymentMethodRef);

    const promises = [
      this.paymentMethodFormRef?.validate(),
      this.billingFormRef?.validate()
    ];

    if (this.insuranceFormRef) {
      promises.push(this.insuranceFormRef.validate());
    }

    // Add Plaid validation if it's the selected payment method
    if (checkoutStore.selectedPaymentMethod === 'plaid' && this.plaidPaymentMethodRef) {
      promises.push(this.plaidPaymentMethodRef.validate());
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
    } else if (checkoutStore.selectedPaymentMethod === 'plaid') {
      // Handle Plaid payment method
      if (!this.plaidPaymentMethodRef) {
        this.errorEvent.emit({
          message: 'Plaid payment method not found.',
          errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
          severity: ComponentErrorSeverity.ERROR,
        });
        return;
      }

      const plaidResult = await this.plaidPaymentMethodRef.resolvePaymentMethod();
      if (plaidResult.validationError) {
        this.errorEvent.emit({
          message: 'Please complete Plaid bank authentication.',
          errorCode: ComponentErrorCodes.VALIDATION_ERROR,
          severity: ComponentErrorSeverity.ERROR,
        });
        return;
      }

      // For Plaid, we need to tokenize the bank account on the backend
      // The public token is already stored in the component
      payment = {
        payment_mode: 'ecom',
        payment_token: plaidResult.token,
      };
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

  @Method()
  async setSelectedPaymentMethod(paymentMethodId: string): Promise<void> {
    checkoutStore.selectedPaymentMethod = paymentMethodId;
  }

  render() {
    return (
      <Host>
      </Host>
    );
  }
}
