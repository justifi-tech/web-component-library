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
import { checkoutStore, onAnyChange, getAvailablePaymentMethodTypes, getCheckoutState, CheckoutState } from "../../store/checkout.store";
import JustifiAnalytics from "../../api/Analytics";
import { detectDuplicateVersion } from "../../utils/detect-duplicate-version";
import {
  ComponentErrorCodes,
  ComponentErrorMessages,
  ComponentErrorSeverity,
  ICheckout,
  ICheckoutStatus,
} from "../../api";
import {
  makeCheckoutComplete,
  makeGetCheckout,
} from "../../actions/checkout/checkout-actions";
import { CheckoutService } from "../../api/services/checkout.service";
import { PlaidService } from "../../api/services/plaid.service";
import { BillingFormFields } from "../../components";
import { insuranceValues, insuranceValuesOn, hasInsuranceValueChanged } from "../insurance/insurance-state";
import { PAYMENT_MODE, CheckoutChangedEventDetail, SelectedPaymentMethod, PAYMENT_METHODS, PaymentMethod, Hook } from "./ModularCheckout";
import { emitPublic } from '../../api/emit-public';

@Component({
  tag: "justifi-modular-checkout",
  shadow: false,
})
export class JustifiModularCheckout {
  analytics!: JustifiAnalytics;
  private observer?: MutationObserver;
  private unsubscribeCheckoutChanges?: () => void;
  private paymentMethodFormRef?:
    | HTMLJustifiCardFormElement
    | HTMLJustifiBankAccountFormElement
    | HTMLJustifiTokenizePaymentMethodElement;
  private billingFormRef?:
    | HTMLJustifiBillingFormElement
    | HTMLJustifiBankAccountBillingFormSimpleElement
    | HTMLJustifiCardBillingFormSimpleElement
    | HTMLJustifiTokenizePaymentMethodElement;
  private insuranceFormRef?: HTMLJustifiSeasonInterruptionInsuranceElement;
  private applePayRef?: HTMLJustifiApplePayElement;
  private googlePayRef?: HTMLJustifiGooglePayElement;
  private paypalRef?: HTMLJustifiPaypalElement;
  private getCheckout!: Function;
  private completeCheckout: Function;
  private plaidService = new PlaidService();

  @Prop() authToken!: string;
  @Prop() checkoutId!: string;
  @Prop() preCompleteHook?: Hook<CheckoutState>;
  /**
   * Mask the card number to its last four digits when the field loses focus,
   * with an eye toggle to reveal it. Applies to the `justifi-card-form`
   * rendered inside this checkout. Defaults to false.
   *
   * Anti-shoulder-surfing only, not a secrecy boundary.
   */
  @Prop() maskCardNumber?: boolean = false;

  @Watch('maskCardNumber')
  maskCardNumberChanged() {
    checkoutStore.maskCardNumber = !!this.maskCardNumber;
  }

  /**
   * Render a required "Confirm Account Number" field in the
   * `justifi-bank-account-form` rendered inside this checkout, and fail
   * validation when it does not match the account number. Defaults to false.
   */
  @Prop() showAccountNumberConfirmation?: boolean = false;

  @Watch('showAccountNumberConfirmation')
  showAccountNumberConfirmationChanged() {
    checkoutStore.showAccountNumberConfirmation =
      !!this.showAccountNumberConfirmation;
  }

  @Element() hostEl!: HTMLElement;

  @Event({ eventName: 'justifi-error' }) errorEvent!: EventEmitter;
  /** @deprecated Listen for `justifi-error`. Removed in the next major. */
  @Event({ eventName: 'error-event' }) errorEventLegacy!: EventEmitter;
  @Event({ eventName: 'justifi-submit' }) submitEvent!: EventEmitter;
  /** @deprecated Listen for `justifi-submit`. Removed in the next major. */
  @Event({ eventName: 'submit-event' }) submitEventLegacy!: EventEmitter;
  @Event({ eventName: 'justifi-checkout-changed' }) checkoutChangedEvent!: EventEmitter<CheckoutChangedEventDetail>;
  /** @deprecated Listen for `justifi-checkout-changed`. Removed in the next major. */
  @Event({ eventName: 'checkout-changed' }) checkoutChangedEventLegacy!: EventEmitter<CheckoutChangedEventDetail>;

  connectedCallback() {
    this.observer = new MutationObserver(() => {
      this.queryFormRefs();
      this.setupApplePayListeners(); // set up again listeners when DOM changes
      this.setupGooglePayListeners();
      this.setupPaypalListeners();
    });

    this.observer.observe(this.hostEl, {
      childList: true,
      subtree: true,
    });

    checkoutStore.checkoutId = this.checkoutId;
    checkoutStore.maskCardNumber = !!this.maskCardNumber;
    checkoutStore.showAccountNumberConfirmation =
      !!this.showAccountNumberConfirmation;

    const config = {
      authToken: this.authToken,
      checkoutId: this.checkoutId,
      service: new CheckoutService(),
    };

    this.getCheckout = makeGetCheckout(config);
    this.completeCheckout = makeCheckoutComplete(config);

    this.unsubscribeCheckoutChanges?.();
    this.unsubscribeCheckoutChanges = onAnyChange(() => {
      this.emitCheckoutChanged();
    });
  }

  componentWillLoad() {
    this.analytics = new JustifiAnalytics(this);
    detectDuplicateVersion();
    checkoutStore.authToken = this.authToken;
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
    this.setupGooglePayListeners();
    this.setupPaypalListeners();
  }

  disconnectedCallback() {
    this.unsubscribeCheckoutChanges?.();
    this.unsubscribeCheckoutChanges = undefined;
    this.observer?.disconnect();
    this.removeApplePayListeners();
    this.removeGooglePayListeners();
    this.removePaypalListeners();
  }

  private fetchCheckout() {
    if (!this.authToken || !this.checkoutId) {
      emitPublic(this.errorEvent, this.errorEventLegacy, {
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
            emitPublic(this.errorEvent, this.errorEventLegacy, {
              message: ComponentErrorMessages.CHECKOUT_ALREADY_COMPLETED,
              errorCode: ComponentErrorCodes.CHECKOUT_ALREADY_COMPLETED,
              severity: ComponentErrorSeverity.ERROR,
            });
            return;
          } else if (checkout.status === ICheckoutStatus.expired) {
            emitPublic(this.errorEvent, this.errorEventLegacy, {
              message: ComponentErrorMessages.CHECKOUT_EXPIRED,
              errorCode: ComponentErrorCodes.CHECKOUT_EXPIRED,
              severity: ComponentErrorSeverity.ERROR,
            });
            return;
          }
        },
        onError: ({ error, code, severity }) => {
          emitPublic(this.errorEvent, this.errorEventLegacy, {
            message: error,
            errorCode: code,
            severity,
          });
        },
      });
    }
  }

  private updateStore(checkout: ICheckout) {
    checkoutStore.accountId = checkout.account_id;
    const rawMode = checkout.mode != null ? String(checkout.mode).toLowerCase() : '';
    checkoutStore.checkoutMode =
      rawMode === 'test' ? 'test' : rawMode === 'live' ? 'live' : null;
    const mappedPaymentMethods = checkout.payment_methods.map(
      (paymentMethod) => new PaymentMethod(paymentMethod)
    );
    const achEnabled = Boolean(checkout.payment_settings?.ach_payments);
    checkoutStore.paymentMethods = mappedPaymentMethods.filter(
      (pm) =>
        pm.type !== PAYMENT_METHODS.SAVED_BANK_ACCOUNT || achEnabled
    );
    checkoutStore.paymentMethodGroupId = checkout.payment_method_group_id;
    checkoutStore.paymentDescription = checkout.payment_description;
    checkoutStore.totalAmount = checkout.total_amount;
    checkoutStore.paymentAmount = checkout.payment_amount;
    checkoutStore.bnplEnabled = checkout.payment_settings.bnpl_payments;
    checkoutStore.insuranceEnabled = checkout.payment_settings.insurance_payments ?? false;
    checkoutStore.bankAccountVerification = checkout.payment_settings?.bank_account_verification;
    checkoutStore.applePayEnabled = checkout.payment_settings?.apple_payments ?? false;
    checkoutStore.googlePayEnabled = checkout.payment_settings?.google_payments ?? false;
    checkoutStore.paypalEnabled = checkout.payment_settings?.paypal_payments ?? false;
    checkoutStore.paypalProviderClientId = checkout.paypal?.provider_client_id ?? '';
    checkoutStore.achPaymentsEnabled = achEnabled;
    checkoutStore.bnplProviderClientId = checkout?.bnpl?.provider_client_id;
    checkoutStore.bnplProviderMode = checkout?.bnpl?.provider_mode;
    checkoutStore.bnplProviderApiVersion = checkout?.bnpl?.provider_api_version;
    checkoutStore.bnplProviderCheckoutUrl =
      checkout?.bnpl?.provider_checkout_url;
    checkoutStore.paymentCurrency = (
      checkout.payment_currency || checkoutStore.paymentCurrency
    ).toUpperCase();
    checkoutStore.checkoutStatus = checkout.status;
    checkoutStore.checkoutLoaded = true;
  }

  private emitCheckoutChanged() {
    const detail: CheckoutChangedEventDetail = {
      availablePaymentMethodTypes: getAvailablePaymentMethodTypes(),
      selectedPaymentMethod: checkoutStore.selectedPaymentMethod,
      savedPaymentMethods: checkoutStore.paymentMethods,
    };
    emitPublic(this.checkoutChangedEvent, this.checkoutChangedEventLegacy, detail);
  }

  private queryFormRefs() {
    this.billingFormRef = this.hostEl.querySelector(
      "justifi-billing-form, justifi-bank-account-billing-form-simple, justifi-card-billing-form-simple, justifi-billing-form-full, justifi-tokenize-payment-method"
    );
    this.applePayRef = this.hostEl.querySelector("justifi-apple-pay");
    this.googlePayRef = this.hostEl.querySelector("justifi-google-pay");
    this.paypalRef = this.hostEl.querySelector("justifi-paypal");
    this.paymentMethodFormRef =
      this.hostEl.querySelector('justifi-card-form, justifi-bank-account-form, justifi-tokenize-payment-method');

    if (!checkoutStore.selectedPaymentMethod && this.paymentMethodFormRef) {
      const tag = this.paymentMethodFormRef.tagName.toLowerCase();
      if (tag === 'justifi-card-form') {
        checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.NEW_CARD };
      } else if (
        tag === 'justifi-bank-account-form' &&
        (!checkoutStore.checkoutLoaded || checkoutStore.achPaymentsEnabled)
      ) {
        checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.NEW_BANK_ACCOUNT };
      }
    }

    this.insuranceFormRef = this.hostEl.querySelector('justifi-season-interruption-insurance');
  }

  private setupApplePayListeners() {
    if (this.applePayRef) {
      this.applePayRef.addEventListener(
        'justifi-apple-pay-started',
        this.handleApplePayStarted
      );
      this.applePayRef.addEventListener(
        'justifi-apple-pay-completed',
        this.handleApplePayCompleted
      );
      this.applePayRef.addEventListener(
        'justifi-apple-pay-error',
        this.handleApplePayError
      );
      this.applePayRef.addEventListener(
        'justifi-apple-pay-cancelled',
        this.handleApplePayCancelled
      );
    }
  }

  private removeApplePayListeners() {
    if (this.applePayRef) {
      this.applePayRef.removeEventListener(
        'justifi-apple-pay-started',
        this.handleApplePayStarted
      );
      this.applePayRef.removeEventListener(
        'justifi-apple-pay-completed',
        this.handleApplePayCompleted
      );
      this.applePayRef.removeEventListener(
        'justifi-apple-pay-error',
        this.handleApplePayError
      );
      this.applePayRef.removeEventListener(
        'justifi-apple-pay-cancelled',
        this.handleApplePayCancelled
      );
    }
  }

  private setupGooglePayListeners() {
    if (this.googlePayRef) {
      this.googlePayRef.addEventListener(
        'justifi-google-pay-started',
        this.handleGooglePayStarted
      );
      this.googlePayRef.addEventListener(
        'justifi-google-pay-completed',
        this.handleGooglePayCompleted
      );
      this.googlePayRef.addEventListener(
        'justifi-google-pay-cancelled',
        this.handleGooglePayCancelled
      );
    }
  }

  private removeGooglePayListeners() {
    if (this.googlePayRef) {
      this.googlePayRef.removeEventListener(
        'justifi-google-pay-started',
        this.handleGooglePayStarted
      );
      this.googlePayRef.removeEventListener(
        'justifi-google-pay-completed',
        this.handleGooglePayCompleted
      );
      this.googlePayRef.removeEventListener(
        'justifi-google-pay-cancelled',
        this.handleGooglePayCancelled
      );
    }
  }

  private setupPaypalListeners() {
    if (this.paypalRef) {
      this.paypalRef.addEventListener(
        'justifi-paypal-started',
        this.handlePaypalStarted
      );
      this.paypalRef.addEventListener(
        'justifi-paypal-completed',
        this.handlePaypalCompleted
      );
      this.paypalRef.addEventListener(
        'justifi-paypal-cancelled',
        this.handlePaypalCancelled
      );
      this.paypalRef.addEventListener('justifi-paypal-error', this.handlePaypalError);
    }
  }

  private removePaypalListeners() {
    if (this.paypalRef) {
      this.paypalRef.removeEventListener(
        'justifi-paypal-started',
        this.handlePaypalStarted
      );
      this.paypalRef.removeEventListener(
        'justifi-paypal-completed',
        this.handlePaypalCompleted
      );
      this.paypalRef.removeEventListener(
        'justifi-paypal-cancelled',
        this.handlePaypalCancelled
      );
      this.paypalRef.removeEventListener('justifi-paypal-error', this.handlePaypalError);
    }
  }

  private handlePaypalStarted = () => {
    checkoutStore.isWalletProcessing = true;
  };

  private handlePaypalCompleted = (event: CustomEvent) => {
    const { success, paymentMethodId, fundingSource } = event.detail || {};
    checkoutStore.isWalletProcessing = false;

    if (success && paymentMethodId) {
      checkoutStore.paymentToken = paymentMethodId;
      checkoutStore.selectedPaymentMethod = {
        type:
          fundingSource === "venmo"
            ? PAYMENT_METHODS.VENMO
            : PAYMENT_METHODS.PAYPAL,
      };
      this.submitCheckout();
    } else {
      emitPublic(this.errorEvent, this.errorEventLegacy, {
        message: "Paypal payment failed",
        errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  };

  private handlePaypalCancelled = () => {
    checkoutStore.isWalletProcessing = false;
    checkoutStore.paymentToken = undefined;
    checkoutStore.selectedPaymentMethod = undefined;
  };

  private handlePaypalError = (event: CustomEvent) => {
    checkoutStore.isWalletProcessing = false;
    const { error, code } = event.detail || {};
    emitPublic(this.errorEvent, this.errorEventLegacy, {
      message: error || "Paypal error occurred",
      errorCode: `PAYPAL_${code}`,
      severity: ComponentErrorSeverity.ERROR,
    });
  };

  private handleApplePayStarted = () => {
    checkoutStore.isWalletProcessing = true;
  };

  private handleGooglePayStarted = () => {
    checkoutStore.isWalletProcessing = true;
  };

  private handleGooglePayCompleted = (event: CustomEvent) => {
    const { success, paymentMethodId, error } = event.detail || {};
    if (success && paymentMethodId) {
      checkoutStore.isWalletProcessing = false;
      checkoutStore.paymentToken = paymentMethodId;
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.GOOGLE_PAY };
      this.submitCheckout();
    } else {
      checkoutStore.isWalletProcessing = false;
      emitPublic(this.errorEvent, this.errorEventLegacy, {
        message: (error && error.message) || "Google Pay payment failed",
        errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  };

  private handleGooglePayCancelled = () => {
    checkoutStore.isWalletProcessing = false;
    checkoutStore.paymentToken = undefined;
    checkoutStore.selectedPaymentMethod = undefined;
  };

  private handleApplePayCompleted = (event: CustomEvent) => {
    const { success, token, paymentMethodId, error } = event.detail;

    if (success && token) {
      checkoutStore.isWalletProcessing = false;
      checkoutStore.paymentToken = paymentMethodId;
      checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.APPLE_PAY };
      this.submitCheckout();
    } else {
      checkoutStore.isWalletProcessing = false;
      console.error("Apple Pay completed but failed:", error);
      emitPublic(this.errorEvent, this.errorEventLegacy, {
        message: error?.message || "Apple Pay payment failed",
        errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  };

  private handleApplePayError = (event: CustomEvent) => {
    checkoutStore.isWalletProcessing = false;
    const { error, code } = event.detail;
    console.error("Apple Pay error:", error);
    emitPublic(this.errorEvent, this.errorEventLegacy, {
      message: error || "Apple Pay error occurred",
      // prefix with APPLE_PAY_
      errorCode: `APPLE_PAY_${code}`,
      severity: ComponentErrorSeverity.ERROR,
    });
  };

  private handleApplePayCancelled = () => {
    checkoutStore.isWalletProcessing = false;
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

  @Method()
  async fillBillingForm(fields: BillingFormFields): Promise<void> {
    checkoutStore.billingFormFields = fields;
  }

  // set the selected payment method to the checkout store from outside the component
  @Method()
  async setSelectedPaymentMethod(paymentMethod: SelectedPaymentMethod) {
    checkoutStore.selectedPaymentMethod = paymentMethod;
    checkoutStore.paymentToken = paymentMethod.id || undefined;
  }

  // if validation fails, the error will be emitted by the component
  @Method()
  async validate(): Promise<boolean> {
    const promises: Promise<any>[] = [];

    if (checkoutStore.insuranceEnabled && this.insuranceFormRef) {
      promises.push(this.insuranceFormRef.validate());
    }

    const isNewCard = checkoutStore.selectedPaymentMethod?.type === PAYMENT_METHODS.NEW_CARD
    const isNewBankAccount = checkoutStore.selectedPaymentMethod?.type === PAYMENT_METHODS.NEW_BANK_ACCOUNT

    // For new card/bank account, validate payment method + billing.
    if (
      isNewCard || isNewBankAccount
    ) {
      if (this.paymentMethodFormRef) promises.push(this.paymentMethodFormRef.validate());
      // queryFormRefs matches justifi-tokenize-payment-method with both
      // selectors, so a checkout that slots only that component gets the same
      // element in both refs -- and that component already validates its own
      // billing form. Validating it again doubles every hosted-field round
      // trip and runs the billing form twice.
      if (this.billingFormRef && this.billingFormRef !== this.paymentMethodFormRef) {
        promises.push(this.billingFormRef.validate());
      }
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
        emitPublic(this.errorEvent, this.errorEventLegacy, {
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
    if (checkoutStore.isSubmitting) return;
    checkoutStore.isSubmitting = true;

    const isValid = await this.validate();

    if (!checkoutStore.selectedPaymentMethod) {
      checkoutStore.isSubmitting = false;
      emitPublic(this.errorEvent, this.errorEventLegacy, {
        message: 'No payment method selected.',
        errorCode: ComponentErrorCodes.VALIDATION_ERROR,
        severity: ComponentErrorSeverity.ERROR,
      });
      return;
    }

    if (!isValid) {
      checkoutStore.isSubmitting = false;
      emitPublic(this.errorEvent, this.errorEventLegacy, {
        message: "Please fill in all required fields.",
        errorCode: ComponentErrorCodes.VALIDATION_ERROR,
        severity: ComponentErrorSeverity.ERROR,
      });
      return;
    }

    const isNewCard =
      checkoutStore.selectedPaymentMethod?.type === PAYMENT_METHODS.NEW_CARD
    const isNewBankAccount =
      checkoutStore.selectedPaymentMethod?.type === PAYMENT_METHODS.NEW_BANK_ACCOUNT

    const isPlaid = checkoutStore.selectedPaymentMethod?.type === PAYMENT_METHODS.PLAID;

    const shouldTokenize = isNewCard || isNewBankAccount;

    if (shouldTokenize) {
      const tokenizeResult = await this.tokenizePaymentMethod(submitCheckoutArgs);

      if ((tokenizeResult as any)?.error) {
        checkoutStore.isSubmitting = false;
        emitPublic(this.errorEvent, this.errorEventLegacy, {
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
        checkoutStore.isSubmitting = false;
        emitPublic(this.errorEvent, this.errorEventLegacy, {
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
          checkoutStore.isSubmitting = false;
          emitPublic(this.errorEvent, this.errorEventLegacy, {
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
        checkoutStore.isSubmitting = false;
        emitPublic(this.errorEvent, this.errorEventLegacy, {
          message: (err as any)?.message || 'Plaid exchange error',
          errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
          severity: ComponentErrorSeverity.ERROR,
        });
        return;
      }
    }

    // Sezzle has no payment token; approval comes from the Sezzle popup
    const isSezzle = checkoutStore.selectedPaymentMethod?.type === PAYMENT_METHODS.SEZZLE;

    if (isSezzle) {
      const sezzleRef = this.hostEl.querySelector('justifi-sezzle-payment-method');
      const payload = await sezzleRef?.resolvePaymentMethod({ isValid });

      if (payload?.bnpl?.status !== 'success') {
        checkoutStore.isSubmitting = false;
        emitPublic(this.errorEvent, this.errorEventLegacy, {
          message: payload?.error?.message || 'Sezzle checkout was not completed.',
          errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
          severity: ComponentErrorSeverity.ERROR,
        });
        return;
      }
    }

    if (!isSezzle && !checkoutStore.paymentToken) {
      checkoutStore.isSubmitting = false;
      emitPublic(this.errorEvent, this.errorEventLegacy, {
        message: 'Payment token not found.',
        errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
        severity: ComponentErrorSeverity.ERROR,
      });
      return;
    }

    const mapTypeToPaymentMode = (type: string | undefined): string | undefined => {
      switch (type) {
        case PAYMENT_METHODS.NEW_CARD:
        case PAYMENT_METHODS.SAVED_CARD:
        case PAYMENT_METHODS.NEW_BANK_ACCOUNT:
        case PAYMENT_METHODS.SAVED_BANK_ACCOUNT:
        case PAYMENT_METHODS.PLAID:
          return PAYMENT_MODE.ECOM;
        case PAYMENT_METHODS.SEZZLE:
          return PAYMENT_MODE.BNPL;
        case PAYMENT_METHODS.APPLE_PAY:
          return PAYMENT_MODE.APPLE_PAY;
        case PAYMENT_METHODS.GOOGLE_PAY:
          return PAYMENT_MODE.GOOGLE_PAY;
        case PAYMENT_METHODS.PAYPAL:
          return PAYMENT_MODE.PAYPAL;
        case PAYMENT_METHODS.VENMO:
          return PAYMENT_MODE.VENMO;
        default:
          return undefined;
      }
    };

    const payment = {
      payment_mode: mapTypeToPaymentMode(checkoutStore.selectedPaymentMethod?.type) as string,
      payment_token: isSezzle ? undefined : checkoutStore.paymentToken,
    };

    if (this.preCompleteHook) {
      const state = getCheckoutState();

      try {
        await new Promise<void>((resolve, reject) => {
          this.preCompleteHook(
            state,
            () => resolve(),
            () => reject()
          );
        });
      } catch (error) {
        checkoutStore.isSubmitting = false;
        console.log('Checkout cancelled by preCompleteHook', error);
        return;
      }
    }

    this.completeCheckout({
      payment,
      onSuccess: ({ checkout }) => {
        checkoutStore.isSubmitting = false;
        emitPublic(this.submitEvent, this.submitEventLegacy, {
          checkout,
          message: "Checkout completed successfully",
        });
      },
      onError: ({ error }) => {
        checkoutStore.isSubmitting = false;
        emitPublic(this.errorEvent, this.errorEventLegacy, {
          message: error,
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
