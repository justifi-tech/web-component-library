import {
  Component,
  h,
  Prop,
  State,
  Event,
  EventEmitter,
  Method,
} from "@stencil/core";
import { ApplePayService, ApplePayServiceErrorCode } from "../../../api/services/apple-pay.service";
import {
  IApplePayConfig,
  IApplePayPaymentRequest,
  ApplePayButtonType,
  ApplePayButtonStyle,
  ApplePayHelpers,
  IApplePayToken,
  ApplePayMerchantCapability,
} from "../../../api/ApplePay";
import { StyledHost } from "../../../ui-components";
import ApplePaySkeleton from "./apple-pay-skeleton";
import { ApplePayButton } from "../../../ui-components/apple-pay-button";
import { checkoutStore, onChange } from "../../../store/checkout.store";
import { emitPublic } from '../../../api/emit-public';
import { PAYMENT_METHODS, SelectedPaymentMethod } from '../ModularCheckout';

@Component({
  tag: "justifi-apple-pay",
  shadow: true,
})
export class JustifiApplePay {
  private applePayService!: ApplePayService;
  private sdkLoaded = false;
  @Prop() countryCode: string = "US";
  @Prop() merchantIdentifier: string =
    "merchant.com.staging-justifi.checkout-dev";
  @Prop() merchantDisplayName: string = "JustiFi Checkout";
  @Prop() initiativeContext: string = "dev-checkout.justifi-staging.com";
  @Prop() buttonType: ApplePayButtonType = ApplePayButtonType.PLAIN;
  @Prop() buttonStyle: ApplePayButtonStyle = ApplePayButtonStyle.BLACK;
  @Prop() disabled: boolean = false;
  @Prop() width: string = "100%";
  @Prop() height: string = "48px";

  @State() isLoading: boolean = true;
  @State() isProcessing: boolean = false;
  @State() isAvailable: boolean = false;
  @State() canMakePayments: boolean = false;
  @State() isConfigValid: boolean = true;
  @State() error: string | null = null;

  @Event({ eventName: 'justifi-payment-method-selected', bubbles: true })
  paymentMethodSelected: EventEmitter<SelectedPaymentMethod>;
  @Event({ eventName: 'justifi-apple-pay-started' }) applePayStarted!: EventEmitter<void>;
  /** @deprecated Listen for `justifi-apple-pay-started`. Removed in the next major. */
  @Event({ eventName: 'applePayStarted' }) applePayStartedLegacy!: EventEmitter<void>;
  @Event({ eventName: 'justifi-apple-pay-completed' }) applePayCompleted!: EventEmitter<{
    success: boolean;
    token?: IApplePayToken;
    paymentMethodId?: string;
    error?: any;
  }>;
  /** @deprecated Listen for `justifi-apple-pay-completed`. Removed in the next major. */
  @Event({ eventName: 'applePayCompleted' }) applePayCompletedLegacy!: EventEmitter<{
    success: boolean;
    token?: IApplePayToken;
    paymentMethodId?: string;
    error?: any;
  }>;
  @Event({ eventName: 'justifi-apple-pay-cancelled' }) applePayCancelled!: EventEmitter<void>;
  /** @deprecated Listen for `justifi-apple-pay-cancelled`. Removed in the next major. */
  @Event({ eventName: 'applePayCancelled' }) applePayCancelledLegacy!: EventEmitter<void>;
  @Event({ eventName: 'justifi-apple-pay-error' }) applePayError!: EventEmitter<{ error: string, code: string }>;
  /** @deprecated Listen for `justifi-apple-pay-error`. Removed in the next major. */
  @Event({ eventName: 'applePayError' }) applePayErrorLegacy!: EventEmitter<{ error: string, code: string }>;

  // Centralized error codes for the Apple Pay component layer
  static ErrorCode = {
    CONFIG_ERROR: 'CONFIG_ERROR',
    NOT_SUPPORTED: 'NOT_SUPPORTED',
    NOT_AVAILABLE: 'NOT_AVAILABLE',
    INITIALIZATION_ERROR: 'INITIALIZATION_ERROR',
    PAYMENT_FAILED: 'PAYMENT_FAILED',
  } as const;

  componentWillLoad() {
    this.isAvailable = ApplePayHelpers.isApplePaySupported();
    if (!this.isAvailable) {
      this.isLoading = false;
      return;
    }
    if (checkoutStore.checkoutLoaded) {
      this.loadApplePaySDK();
    } else {
      onChange('checkoutLoaded', (loaded) => {
        if (loaded) this.loadApplePaySDK();
      });
    }
  }

  private countryCodeForCurrency(currency: string) {
    if (currency.toLowerCase() == "cad") {
      return "CA"
    }

    return "US"
  }

  private loadApplePaySDK() {
    if (this.sdkLoaded) return;
    this.sdkLoaded = true;
    const script = document.createElement('script');
    script.src = 'https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js';
    script.async = true;
    script.onload = () => this.initializeApplePay();
    document.head.appendChild(script);
  }

  private async initializeApplePay() {
    try {
      this.isLoading = true;
      this.error = null;
      this.isConfigValid = true;

      const hasRequiredConfig =
        Boolean(checkoutStore.paymentAmount) &&
        Boolean(checkoutStore.paymentCurrency) &&
        Boolean(checkoutStore.authToken);

      if (!hasRequiredConfig) {
        this.error = "Missing required Apple Pay configuration";
        this.isConfigValid = false;
        emitPublic(this.applePayError, this.applePayErrorLegacy, { error: this.error, code: JustifiApplePay.ErrorCode.CONFIG_ERROR });
        this.isLoading = false;
        return;
      }

      this.isAvailable = ApplePayHelpers.isApplePaySupported();
      this.canMakePayments = ApplePayHelpers.canMakePayments();

      if (!this.isAvailable) {
        this.error = "Apple Pay is not supported on this device";
        emitPublic(this.applePayError, this.applePayErrorLegacy, { error: this.error, code: JustifiApplePay.ErrorCode.NOT_SUPPORTED });
        this.isLoading = false;
        return;
      }

      if (!this.canMakePayments) {
        this.error = "Apple Pay is not available";
        emitPublic(this.applePayError, this.applePayErrorLegacy, { error: this.error, code: JustifiApplePay.ErrorCode.NOT_AVAILABLE });
        this.isLoading = false;
        return;
      }

      const applePayConfig: IApplePayConfig = {
        merchantIdentifier: this.merchantIdentifier,
        displayName: this.merchantDisplayName,
        initiative: "web",
        initiativeContext: this.initiativeContext,
        buttonType: this.buttonType,
        buttonStyle: this.buttonStyle,
      };

      this.applePayService = new ApplePayService();
      this.applePayService.initialize(applePayConfig);

      const hasActiveCard =
        await this.applePayService.canMakePaymentsWithActiveCard();
      if (!hasActiveCard) {
        console.warn("No Apple Pay cards available, but continuing...");
      }
    } catch (error) {
      this.error =
        error instanceof Error
          ? error.message
          : "Failed to initialize Apple Pay";
      emitPublic(this.applePayError, this.applePayErrorLegacy, { error: this.error, code: JustifiApplePay.ErrorCode.INITIALIZATION_ERROR });
    } finally {
      this.isLoading = false;
    }
  }

  private handleApplePayClick = async () => {
    if (this.isProcessing || this.disabled || !this.isAvailable) {
      return;
    }

    try {
      this.isProcessing = true;
      this.error = null;
      emitPublic(this.applePayStarted, this.applePayStartedLegacy);
      emitPublic(this.paymentMethodSelected, null, {
        type: PAYMENT_METHODS.APPLE_PAY,
      });

      const paymentRequest: IApplePayPaymentRequest = {
        countryCode: this.countryCodeForCurrency(checkoutStore.paymentCurrency),
        currencyCode: checkoutStore.paymentCurrency,
        merchantCapabilities: [
          ApplePayMerchantCapability.SUPPORTS_3DS,
          ApplePayMerchantCapability.SUPPORTS_CREDIT,
          ApplePayMerchantCapability.SUPPORTS_DEBIT,
        ],
        supportedNetworks: ApplePayHelpers.getDefaultSupportedNetworks(),
        total: ApplePayHelpers.createLineItem(
          checkoutStore.paymentDescription,
          checkoutStore.paymentAmount
        ),
      };


      const result = await this.applePayService.startPaymentSession(
        paymentRequest,
        checkoutStore.authToken,
        checkoutStore.accountId
      );

      if (result.success) {
        emitPublic(this.applePayCompleted, this.applePayCompletedLegacy, {
          success: true,
          token: result.token,
          paymentMethodId: result.paymentMethodId,
        });
      } else {
        emitPublic(this.applePayCompleted, this.applePayCompletedLegacy, {
          success: false,
          error: result.error,
        });
        emitPublic(this.applePayError, this.applePayErrorLegacy, {
          error: result.error?.message || "Payment failed",
          code: result.error?.code || JustifiApplePay.ErrorCode.PAYMENT_FAILED,
        });
      }
    } catch (error) {
      if (error?.error?.code === ApplePayServiceErrorCode.USER_CANCELLED) {
        emitPublic(this.applePayCancelled, this.applePayCancelledLegacy);
      } else {
        const errorMessage =
          error instanceof Error ? error.message : "Payment failed";
        this.error = errorMessage;
        emitPublic(this.applePayError, this.applePayErrorLegacy, { error: errorMessage, code: JustifiApplePay.ErrorCode.PAYMENT_FAILED });
        emitPublic(this.applePayCompleted, this.applePayCompletedLegacy, {
          success: false,
          error: errorMessage,
        });
      }
    } finally {
      this.isProcessing = false;
    }
  };

  @Method()
  async isSupported(): Promise<boolean> {
    return this.isAvailable && this.canMakePayments;
  }

  @Method()
  async getPaymentMethods(): Promise<string[]> {
    if (!this.isAvailable) {
      return [];
    }
    return ApplePayHelpers.getDefaultSupportedNetworks();
  }

  @Method()
  async abort(): Promise<void> {
    this.applePayService?.abortPaymentSession();
    this.isProcessing = false;
    emitPublic(this.applePayCancelled, this.applePayCancelledLegacy);
  }

  render() {
    if (!checkoutStore.applePayEnabled) {
      // Render nothing when Apple Pay is disabled at the checkout settings level
      return null;
    }
    if (!this.isAvailable) {
      return null;
    }

    const isReady =
      !this.isLoading &&
      this.isAvailable &&
      this.canMakePayments &&
      this.isConfigValid;

    return (
      <StyledHost>
        <div class='apple-pay-container'>
          <ApplePaySkeleton isLoading={this.isLoading} />

          {isReady && (
            <ApplePayButton
              buttonType={this.buttonType}
              buttonStyle={this.buttonStyle}
              disabled={this.disabled}
              isProcessing={this.isProcessing}
              isAvailable={this.isAvailable}
              clickHandler={this.handleApplePayClick}
              width={this.width}
              height={this.height}
            />
          )}
        </div>

        <style>
          {`
            .apple-pay-container {
              width: 100%;
            }
          `}
        </style>
      </StyledHost>
    );
  }
}
