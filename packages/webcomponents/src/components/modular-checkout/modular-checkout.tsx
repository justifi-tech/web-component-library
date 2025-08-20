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
  private plaidPaymentMethodRef?: HTMLJustifiPlaidPaymentMethodElement;
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
    console.debug('[ModularCheckout] connectedCallback', {
      checkoutId: this.checkoutId,
      hasAuthToken: !!this.authToken,
    });
    this.observer = new MutationObserver(() => {
      this.queryFormRefs();
      console.debug('[ModularCheckout] DOM mutated: re-queried form refs');
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
      console.debug('[ModularCheckout] selectedPaymentMethod changed', { newValue });
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
      console.debug('[ModularCheckout] componentWillLoad: missing authToken or checkoutId, emitted NOT_AUTHENTICATED');
      return;
    }
    this.analytics = new JustifiAnalytics(this);
    checkPkgVersion();
    checkoutStore.authToken = this.authToken;
    checkoutStore.savePaymentMethod = this.savePaymentMethod;
    console.debug('[ModularCheckout] componentWillLoad: initialized analytics and store, fetching checkout');
    this.fetchCheckout();

    // Refresh the checkout data when insurance values actually change (not on initial load)
    insuranceValuesOn('set', (key: string) => {
      const value = insuranceValues[key];
      if (value !== undefined && hasInsuranceValueChanged(key, value)) {
        console.debug('[ModularCheckout] insurance value changed, refreshing checkout', { key, value });
        this.fetchCheckout();
      }
    });
  }

  componentDidLoad() {
    this.queryFormRefs();
    console.debug('[ModularCheckout] componentDidLoad: queried form refs');
  }

  disconnectedCallback() {
    this.observer?.disconnect();
    console.debug('[ModularCheckout] disconnectedCallback: observer disconnected');
  }

  private fetchCheckout() {
    if (this.getCheckout) {
      console.debug('[ModularCheckout] fetchCheckout: calling getCheckout');
      this.getCheckout({
        onSuccess: ({ checkout }) => {
          console.debug('[ModularCheckout] fetchCheckout: success', { status: checkout.status, total_amount: checkout.total_amount });
          if (checkout.status === ICheckoutStatus.completed) {
            this.errorEvent.emit({
              message: ComponentErrorMessages.CHECKOUT_ALREADY_COMPLETED,
              errorCode: ComponentErrorCodes.CHECKOUT_ALREADY_COMPLETED,
              severity: ComponentErrorSeverity.ERROR,
            });
            console.debug('[ModularCheckout] fetchCheckout: emitted CHECKOUT_ALREADY_COMPLETED');
            return;
          } else if (checkout.status === ICheckoutStatus.expired) {
            this.errorEvent.emit({
              message: ComponentErrorMessages.CHECKOUT_EXPIRED,
              errorCode: ComponentErrorCodes.CHECKOUT_EXPIRED,
              severity: ComponentErrorSeverity.ERROR,
            });
            console.debug('[ModularCheckout] fetchCheckout: emitted CHECKOUT_EXPIRED');
            return;
          }

          this.updateStore(checkout);
        },
        onError: (error) => {
          console.debug('[ModularCheckout] fetchCheckout: error', { message: error.message });
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
    console.debug('[ModularCheckout] updateStore with checkout data', {
      account_id: checkout.account_id,
      payment_method_group_id: checkout.payment_method_group_id,
      total_amount: checkout.total_amount,
      payment_amount: checkout.payment_amount,
      bnpl_enabled: checkout.payment_settings?.bnpl_payments,
    });
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
      this.hostEl.querySelector('justifi-card-form, justifi-bank-account-form');

    this.billingFormRef =
      this.hostEl.querySelector('justifi-billing-form-full, justifi-card-billing-form-simple, justifi-bank-account-billing-form-simple');

    this.insuranceFormRef = this.hostEl.querySelector('justifi-season-interruption-insurance');
    this.sezzlePaymentMethodRef = this.hostEl.querySelector('justifi-sezzle-payment-method');
    this.plaidPaymentMethodRef = this.hostEl.querySelector('justifi-plaid-payment-method');
    console.debug('[ModularCheckout] queryFormRefs', {
      hasPaymentMethodForm: !!this.paymentMethodFormRef,
      hasBillingForm: !!this.billingFormRef,
      hasInsuranceForm: !!this.insuranceFormRef,
      hasSezzle: !!this.sezzlePaymentMethodRef,
      hasPlaid: !!this.plaidPaymentMethodRef,
    });
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
    console.debug('[ModularCheckout] getPaymentMethod: tokenize response', {
      hasError: !!error,
      hasToken: !!token,
    });

    if (error) {
      console.error('[ModularCheckout] getPaymentMethod: tokenization error', {
        code: error.code,
        message: error.message,
      });
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
    console.debug('[ModularCheckout] validate: refs', {
      billingFormRef: !!this.billingFormRef,
      paymentMethodFormRef: !!this.paymentMethodFormRef,
      insuranceFormRef: !!this.insuranceFormRef,
      sezzlePaymentMethodRef: !!this.sezzlePaymentMethodRef,
      plaidPaymentMethodRef: !!this.plaidPaymentMethodRef,
    });

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
    const isValid = validationResults.every(result => result?.isValid !== false);
    console.debug('[ModularCheckout] validate: results', { validationResults, isValid });
    return isValid;
  }

  @Method()
  async submitCheckout(submitCheckoutArgs?: BillingFormFields): Promise<void> {
    console.debug('[ModularCheckout] submitCheckout: start');
    const isValid = await this.validate();
    if (!isValid) {
      console.warn('[ModularCheckout] submitCheckout: validation failed', {
        refs: {
          billingFormRef: !!this.billingFormRef,
          paymentMethodFormRef: !!this.paymentMethodFormRef,
          insuranceFormRef: !!this.insuranceFormRef,
          sezzlePaymentMethodRef: !!this.sezzlePaymentMethodRef,
          plaidPaymentMethodRef: !!this.plaidPaymentMethodRef,
        },
        selectedPaymentMethod: checkoutStore.selectedPaymentMethod,
      });
      this.errorEvent.emit({
        message: 'Please fill in all required fields.',
        errorCode: ComponentErrorCodes.VALIDATION_ERROR,
        severity: ComponentErrorSeverity.ERROR,
      });
      return;
    }

    let payment: { payment_mode: string; payment_token: string | undefined };

    if (checkoutStore.selectedPaymentMethod === 'sezzle') {
      console.debug('[ModularCheckout] submitCheckout: sezzle selected');
      const insuranceValidation = this.insuranceFormRef ? await this.insuranceFormRef.validate() : { isValid: true };
      const sezzleResult = await this.sezzlePaymentMethodRef.resolvePaymentMethod(insuranceValidation);
      if (sezzleResult.error) {
        console.debug('[ModularCheckout] submitCheckout: sezzle error', { message: sezzleResult.error.message });
        this.errorEvent.emit({
          message: sezzleResult.error.message,
          errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
          severity: ComponentErrorSeverity.ERROR,
        });
        return;
      } else if (sezzleResult.bnpl?.status === 'success') {
        console.debug('[ModularCheckout] submitCheckout: sezzle success');
        payment = {
          payment_mode: 'bnpl',
          payment_token: undefined,
        };
      }
    } else if (checkoutStore.selectedPaymentMethod === 'plaid') {
      console.debug('[ModularCheckout] submitCheckout: plaid selected');
      // Handle Plaid payment method
      if (!this.plaidPaymentMethodRef) {
        this.errorEvent.emit({
          message: 'Plaid payment method not found.',
          errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
          severity: ComponentErrorSeverity.ERROR,
        });
        return;
      }

      // Ensure we have a backend payment token (not the Plaid public_token)
      const plaidPaymentToken: string | undefined = await this.plaidPaymentMethodRef.getPaymentToken();
      console.debug('[ModularCheckout] submitCheckout: plaid getPaymentToken result', { hasToken: !!plaidPaymentToken });
      if (!plaidPaymentToken) {
        console.error('[ModularCheckout] submitCheckout: missing Plaid payment token after exchange');
        this.errorEvent.emit({
          message: 'Unable to tokenize bank account. Please try again.',
          errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
          severity: ComponentErrorSeverity.ERROR,
        });
        return;
      }

      // Save for consistency with other flows
      checkoutStore.paymentToken = plaidPaymentToken;

      payment = {
        payment_mode: 'ecom',
        payment_token: plaidPaymentToken,
      };
    } else {
      const paymentMethod = await this.getPaymentMethod(submitCheckoutArgs);
      console.debug('[ModularCheckout] submitCheckout: ecom selected, token result', { hasToken: !!paymentMethod });
      if (!paymentMethod) {
        console.error('[ModularCheckout] submitCheckout: missing payment method token after tokenization');
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


    console.debug('[ModularCheckout] submitCheckout: invoking completeCheckout');
    this.completeCheckout({
      payment,
      onSuccess: ({ checkout }) => {
        console.debug('[ModularCheckout] submitCheckout: completeCheckout success');
        this.submitEvent.emit({
          checkout,
          message: 'Checkout completed successfully',
        });
      },
      onError: (error) => {
        console.debug('[ModularCheckout] submitCheckout: completeCheckout error', { message: error.message });
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
