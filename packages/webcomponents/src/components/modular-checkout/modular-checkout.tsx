import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop,
  Watch,
} from "@stencil/core";
import { checkoutStore, onAnyChange, getAvailablePaymentMethodTypes } from "../../store/checkout.store";
import JustifiAnalytics from "../../api/Analytics";
import { checkPkgVersion } from "../../utils/check-pkg-version";
import {
  ComponentErrorCodes,
  ComponentErrorMessages,
  ComponentErrorSeverity,
  ICheckout,
  ICheckoutPaymentMethod,
  ICheckoutStatus,
  PaymentMethodTypes,
} from "../../api";
import {
  makeCheckoutComplete,
  makeGetCheckout,
} from "../../actions/checkout/checkout-actions";
import { CheckoutService } from "../../api/services/checkout.service";
import { PlaidService } from "../../api/services/plaid.service";
import { BillingFormFields } from "../../components";
import { insuranceValues, insuranceValuesOn, hasInsuranceValueChanged } from "../insurance/insurance-state";
import { PAYMENT_MODE, CheckoutChangedEventDetail } from "./ModularCheckout";

@Component({
  tag: "justifi-modular-checkout",
  shadow: false,
})
export class ModularCheckout {
  analytics: JustifiAnalytics;
  private observer?: MutationObserver;
  private paymentMethodFormRef?:
    | HTMLJustifiCardFormElement
    | HTMLJustifiBankAccountFormElement;
  private billingFormRef?:
    | HTMLJustifiBillingFormElement
    | HTMLJustifiBankAccountBillingFormSimpleElement
    | HTMLJustifiCardBillingFormSimpleElement;
  private insuranceFormRef?: HTMLJustifiSeasonInterruptionInsuranceElement;
  private applePayRef?: HTMLJustifiApplePayElement;
  private getCheckout: Function;
  private completeCheckout: Function;
  private plaidService = new PlaidService();

  @Prop() authToken: string;
  @Prop() checkoutId: string;
  @Prop() savePaymentMethod?: boolean = false;

  @Element() hostEl: HTMLElement;

  @Event({ eventName: "error-event" }) errorEvent: EventEmitter;
  @Event({ eventName: "submit-event" }) submitEvent: EventEmitter;
  @Event({ eventName: "checkout-changed" })
  checkoutChangedEvent: EventEmitter<CheckoutChangedEventDetail>;

  @Watch("savePaymentMethod")
  savePaymentMethodChanged(newValue: boolean) {
    checkoutStore.savePaymentMethod = newValue;
  }

  connectedCallback() {
    this.observer = new MutationObserver(() => {
      this.queryFormRefs();
      this.setupApplePayListeners(); // set up again listeners when DOM changes
    });

    this.observer.observe(this.hostEl, {
      childList: true,
      subtree: true,
    });

    checkoutStore.checkoutId = this.checkoutId;

    const config = {
      authToken: this.authToken,
      checkoutId: this.checkoutId,
      service: new CheckoutService(),
    };

    this.getCheckout = makeGetCheckout(config);
    this.completeCheckout = makeCheckoutComplete(config);

    // Emit checkout-changed whenever any store key changes
    onAnyChange(() => {
      this.emitCheckoutChanged();
    });
  }

  componentWillLoad() {
    this.analytics = new JustifiAnalytics(this);
    checkPkgVersion();
    checkoutStore.authToken = this.authToken;
    checkoutStore.savePaymentMethod = this.savePaymentMethod;
    this.fetchCheckout();

    // Refresh the checkout data when insurance values actually change (not on initial load)
    insuranceValuesOn("set", (key: string) => {
      const value = insuranceValues[key];
      if (value !== undefined && hasInsuranceValueChanged(key, value)) {
        this.fetchCheckout();
      }
    });
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
    if (!this.authToken || !this.checkoutId) {
      this.errorEvent.emit({
        message: ComponentErrorMessages.NOT_AUTHENTICATED,
        errorCode: ComponentErrorCodes.NOT_AUTHENTICATED,
        severity: ComponentErrorSeverity.ERROR,
      });
      return;
    }

    if (this.getCheckout) {
      this.getCheckout({
        onSuccess: ({ checkout }) => {
          this.updateStore(checkout);
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
        },
        onError: (error) => {
          this.errorEvent.emit({
            message: error.message,
            errorCode: ComponentErrorCodes.FETCH_ERROR,
            severity: ComponentErrorSeverity.ERROR,
          });
        },
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
    checkoutStore.insuranceEnabled = checkout.payment_settings.insurance_payments;
    checkoutStore.bankAccountVerification = checkout.payment_settings?.bank_account_verification;
    checkoutStore.bnplProviderClientId = checkout?.bnpl?.provider_client_id;
    checkoutStore.bnplProviderMode = checkout?.bnpl?.provider_mode;
    checkoutStore.bnplProviderApiVersion = checkout?.bnpl?.provider_api_version;
    checkoutStore.bnplProviderCheckoutUrl =
      checkout?.bnpl?.provider_checkout_url;
  }

  private emitCheckoutChanged() {
    const detail: CheckoutChangedEventDetail = {
      availablePaymentMethodTypes: getAvailablePaymentMethodTypes(),
      selectedPaymentMethod: checkoutStore.selectedPaymentMethod,
      savedPaymentMethods: checkoutStore.paymentMethods,
    };
    this.checkoutChangedEvent.emit(detail);
  }

  private queryFormRefs() {
    this.billingFormRef = this.hostEl.querySelector(
      "justifi-billing-form, justifi-bank-account-billing-form-simple, justifi-card-billing-form-simple, justifi-billing-form-full"
    );
    this.applePayRef = this.hostEl.querySelector("justifi-apple-pay");
    this.paymentMethodFormRef =
      this.hostEl.querySelector('justifi-card-form, justifi-bank-account-form, justifi-tokenize-payment-method');

    this.insuranceFormRef = this.hostEl.querySelector('justifi-season-interruption-insurance');
  }

  private setupApplePayListeners() {
    if (this.applePayRef) {
      this.applePayRef.addEventListener(
        "applePayCompleted",
        this.handleApplePayCompleted
      );
      this.applePayRef.addEventListener(
        "applePayError",
        this.handleApplePayError
      );
      this.applePayRef.addEventListener(
        "applePayCancelled",
        this.handleApplePayCancelled
      );
    }
  }

  private removeApplePayListeners() {
    if (this.applePayRef) {
      this.applePayRef.removeEventListener(
        "applePayCompleted",
        this.handleApplePayCompleted
      );
      this.applePayRef.removeEventListener(
        "applePayError",
        this.handleApplePayError
      );
      this.applePayRef.removeEventListener(
        "applePayCancelled",
        this.handleApplePayCancelled
      );
    }
  }

  private handleApplePayCompleted = (event: CustomEvent) => {
    const { success, token, paymentMethodId, error } = event.detail;

    if (success && token) {
      checkoutStore.paymentToken = paymentMethodId;
      checkoutStore.selectedPaymentMethod = { type: PaymentMethodTypes.applePay };
      this.submitCheckout();
    } else {
      console.error("Apple Pay completed but failed:", error);
      this.errorEvent.emit({
        message: error?.message || "Apple Pay payment failed",
        errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  };

  private handleApplePayError = (event: CustomEvent) => {
    const { error } = event.detail;
    console.error("Apple Pay error:", error);
    this.errorEvent.emit({
      message: error || "Apple Pay error occurred",
      errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
      severity: ComponentErrorSeverity.ERROR,
    });
  };

  private handleApplePayCancelled = () => {
    checkoutStore.paymentToken = undefined;
    checkoutStore.selectedPaymentMethod = undefined;
  };

  private async tokenizePaymentMethod(
    tokenizeArgs: BillingFormFields
  ): Promise<any> {
    const billingInfoValues = (await this.billingFormRef?.getValues()) ?? {};

    const combinedBillingInfo = { ...tokenizeArgs, ...billingInfoValues };

    const paymentMethodMetadata = {
      accountId: checkoutStore.accountId,
      payment_method_group_id: undefined,
      ...combinedBillingInfo,
    };

    if (checkoutStore.savePaymentMethod) {
      paymentMethodMetadata.payment_method_group_id =
        checkoutStore.paymentMethodGroupId;
    }


    const tokenizeResult = await this.paymentMethodFormRef?.tokenize({
      clientId: this.authToken,
      paymentMethodMetadata,
      account: checkoutStore.accountId,
    });

    if (tokenizeResult.error) {
      return tokenizeResult;
    }

    checkoutStore.paymentToken = tokenizeResult.id;

    return tokenizeResult.id;
  }

  // set the selected payment method to the checkout store from outside the component
  @Method()
  async setSelectedPaymentMethod(paymentMethod: ICheckoutPaymentMethod | { type: PaymentMethodTypes }) {
    checkoutStore.selectedPaymentMethod = paymentMethod;
  }

  // getAvailablePaymentMethods removed in favor of checkout-changed event

  // if validation fails, the error will be emitted by the component
  @Method()
  async validate(): Promise<boolean> {
    const promises: Promise<any>[] = [];

    if (checkoutStore.insuranceEnabled && this.insuranceFormRef) {
      promises.push(this.insuranceFormRef.validate());
    }

    const isNewCard = checkoutStore.selectedPaymentMethod.type === PaymentMethodTypes.card && (checkoutStore.selectedPaymentMethod as ICheckoutPaymentMethod).id === undefined;
    const isNewBankAccount = checkoutStore.selectedPaymentMethod.type === PaymentMethodTypes.bankAccount && (checkoutStore.selectedPaymentMethod as ICheckoutPaymentMethod).id === undefined;

    // For new card/bank account, validate payment method + billing.
    if (
      isNewCard ||
      isNewBankAccount
    ) {
      if (this.paymentMethodFormRef) promises.push(this.paymentMethodFormRef.validate());
      if (this.billingFormRef) promises.push(this.billingFormRef.validate());
    }

    if (promises.length === 0) return true;

    try {
      const results = await Promise.all(promises);

      // Normalize different validator return shapes:
      // - boolean -> use it directly
      // - object  -> look for isValid; treat missing isValid as falsey only if explicitly false
      const resultsAreValid = results.every(r =>
        typeof r === 'boolean' ? r : r?.isValid !== false
      );

      if (!resultsAreValid) {
        this.errorEvent.emit({
          message: 'Validation error',
          errorCode: ComponentErrorCodes.VALIDATION_ERROR,
          severity: ComponentErrorSeverity.ERROR,
        });
        return false;
      }

      return true;
    } catch {
      // If any validator throws/rejects, consider the whole validation failed.
      return false;
    }
  }

  @Method()
  async submitCheckout(submitCheckoutArgs?: BillingFormFields): Promise<void> {
    const isValid = await this.validate();

    const isNewCard =
      checkoutStore.selectedPaymentMethod.type === PaymentMethodTypes.card &&
      (checkoutStore.selectedPaymentMethod as ICheckoutPaymentMethod).id === undefined;
    const isNewBankAccount =
      checkoutStore.selectedPaymentMethod.type === PaymentMethodTypes.bankAccount &&
      (checkoutStore.selectedPaymentMethod as ICheckoutPaymentMethod).id === undefined;
    const isPlaid = checkoutStore.selectedPaymentMethod.type === PaymentMethodTypes.plaid;

    const shouldTokenize = isNewCard || isNewBankAccount;

    if (shouldTokenize) {
      const tokenizeResult = await this.tokenizePaymentMethod(submitCheckoutArgs);

      if ((tokenizeResult as any)?.error) {
        this.errorEvent.emit({
          message: (tokenizeResult as any).error.message,
          errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
          severity: ComponentErrorSeverity.ERROR,
        });
        return;
      }
    }

    // For Plaid, perform exchange at submit time using stored public token and link token id
    if (isPlaid && !checkoutStore.paymentToken) {
      const publicToken = checkoutStore.plaidPublicToken;
      const linkTokenId = checkoutStore.plaidLinkTokenId;

      if (!publicToken) {
        this.errorEvent.emit({
          message: 'Missing Plaid public token. Please connect your bank.',
          errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
          severity: ComponentErrorSeverity.ERROR,
        });
        return;
      }

      try {
        const response = await this.plaidService.tokenizeBankAccount(
          checkoutStore.authToken,
          checkoutStore.accountId,
          publicToken,
          linkTokenId || undefined,
          checkoutStore.savePaymentMethod ? checkoutStore.paymentMethodGroupId : undefined
        );

        if (response?.error) {
          this.errorEvent.emit({
            message: typeof response.error === 'string' ? response.error : response.error.message || 'Failed to tokenize bank account',
            errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
            severity: ComponentErrorSeverity.ERROR,
          });
          return;
        }

        const paymentMethod = response?.data;
        const token = paymentMethod?.bank_account?.token || paymentMethod?.token || paymentMethod?.id;
        checkoutStore.paymentToken = token;
      } catch (err) {
        this.errorEvent.emit({
          message: (err as any)?.message || 'Plaid exchange error',
          errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
          severity: ComponentErrorSeverity.ERROR,
        });
        return;
      }
    }

    if (!isValid) {
      this.errorEvent.emit({
        message: "Please fill in all required fields.",
        errorCode: ComponentErrorCodes.VALIDATION_ERROR,
        severity: ComponentErrorSeverity.ERROR,
      });
      return;
    }

    if (!checkoutStore.paymentToken) {
      this.errorEvent.emit({
        message: 'Payment token not found.',
        errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
        severity: ComponentErrorSeverity.ERROR,
      });
      return;
    }

    let payment: { payment_mode: string; payment_token: string | undefined };

    const mapTypeToPaymentMode = (type: string | undefined): string | undefined => {
      switch (type) {
        case PaymentMethodTypes.card:
        case PaymentMethodTypes.bankAccount:
        case PaymentMethodTypes.plaid:
          return PAYMENT_MODE.ECOM;
        case PaymentMethodTypes.sezzle:
          return PAYMENT_MODE.BNPL;
        case PaymentMethodTypes.applePay:
          return PAYMENT_MODE.APPLE_PAY;
        default:
          return undefined;
      }
    };

    payment = {
      payment_mode: mapTypeToPaymentMode(checkoutStore.selectedPaymentMethod.type) as string,
      payment_token: checkoutStore.paymentToken,
    };

    this.completeCheckout({
      payment,
      onSuccess: ({ checkout }) => {
        this.submitEvent.emit({
          checkout,
          message: "Checkout completed successfully",
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
    return <Host></Host>;
  }
}
