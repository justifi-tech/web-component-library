import {
  Component,
  h,
  Prop,
  State,
  Event,
  EventEmitter,
  Method,
} from "@stencil/core";
import { ApplePayService } from "../../../api/services/apple-pay.service";
import {
  IApplePayConfig,
  IApplePayPaymentRequest,
  ApplePayButtonType,
  ApplePayButtonStyle,
  ApplePayHelpers,
  IApplePayToken,
} from "../../../api/ApplePay";
import { StyledHost } from "../../../ui-components";
import ApplePaySkeleton from "./apple-pay-skeleton";
import { ApplePayButton } from "../../../ui-components/apple-pay-button";
import { checkoutStore } from "../../../store/checkout.store";

@Component({
  tag: "justifi-apple-pay",
  shadow: true,
})
export class ApplePay {
  private applePayService: ApplePayService;
  @Prop() countryCode: string = "US";
  @Prop() merchantIdentifier: string =
    "merchant.com.staging-justifi.checkout-dev";
  @Prop() merchantDisplayName: string = "JustiFi Checkout";
  @Prop() initiativeContext: string = "dev-checkout.justifi-staging.com";
  @Prop() buttonType: ApplePayButtonType = ApplePayButtonType.PLAIN;
  @Prop() buttonStyle: ApplePayButtonStyle = ApplePayButtonStyle.BLACK;
  @Prop() disabled: boolean = false;
  @Prop() showSkeleton: boolean = true;

  @State() isLoading: boolean = true;
  @State() isProcessing: boolean = false;
  @State() isAvailable: boolean = false;
  @State() canMakePayments: boolean = false;
  @State() isConfigValid: boolean = true;
  @State() error: string | null = null;

  @Event() applePayStarted: EventEmitter<void>;
  @Event() applePayCompleted: EventEmitter<{
    success: boolean;
    token?: IApplePayToken;
    paymentMethodId?: string;
    error?: any;
  }>;
  @Event() applePayCancelled: EventEmitter<void>;
  @Event() applePayError: EventEmitter<{ error: string }>;

  private async initializeApplePay() {
    try {
      this.isLoading = true;
      this.error = null;
      this.isConfigValid = true;
      console.groupCollapsed('[ApplePay Component] initializeApplePay');
      console.log('[ApplePay Component] checkout state snapshot:', {
        paymentAmount: checkoutStore.paymentAmount,
        paymentCurrency: checkoutStore.paymentCurrency,
        hasAuthToken: Boolean(checkoutStore.authToken),
        accountId: checkoutStore.accountId,
      });

      const hasRequiredConfig =
        Boolean(checkoutStore.paymentAmount) &&
        Boolean(checkoutStore.paymentCurrency) &&
        Boolean(checkoutStore.authToken);

      if (!hasRequiredConfig) {
        this.error = "Missing required Apple Pay configuration";
        this.isConfigValid = false;
        console.error("Apple Pay config error: missing required values", {
          paymentAmount: checkoutStore.paymentAmount,
          paymentCurrency: checkoutStore.paymentCurrency,
          hasAuthToken: Boolean(checkoutStore.authToken),
          accountId: checkoutStore.accountId,
        });
        this.applePayError.emit({ error: this.error });
        this.isLoading = false;
        console.groupEnd();
        return;
      }

      this.isAvailable = ApplePayHelpers.isApplePaySupported();
      this.canMakePayments = ApplePayHelpers.canMakePayments();
      console.log('[ApplePay Component] support check:', {
        isAvailable: this.isAvailable,
        canMakePayments: this.canMakePayments,
        hasApplePaySessionOnWindow: typeof window !== 'undefined' && 'ApplePaySession' in window,
      });

      if (!this.isAvailable) {
        this.error = "Apple Pay is not supported on this device";
        console.error(this.error);
        this.applePayError.emit({ error: this.error });
        this.isLoading = false;
        console.groupEnd();
        return;
      }

      if (!this.canMakePayments) {
        this.error = "Apple Pay is not available";
        console.error(this.error);
        this.applePayError.emit({ error: this.error });
        this.isLoading = false;
        console.groupEnd();
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
      console.log('[ApplePay Component] initializing service with config:', applePayConfig);

      this.applePayService = new ApplePayService();
      this.applePayService.initialize(applePayConfig);

      const hasActiveCard =
        await this.applePayService.canMakePaymentsWithActiveCard();
      if (!hasActiveCard) {
        console.warn("No Apple Pay cards available, but continuing...");
      }
    } catch (error) {
      console.error("Apple Pay initialization error:", error);
      this.error =
        error instanceof Error
          ? error.message
          : "Failed to initialize Apple Pay";
      this.applePayError.emit({ error: this.error });
    } finally {
      this.isLoading = false;
      console.groupEnd();
    }
  }

  private handleApplePayClick = async () => {
    if (this.isProcessing || this.disabled || !this.isAvailable) {
      return;
    }

    try {
      this.isProcessing = true;
      this.error = null;
      this.applePayStarted.emit();
      console.groupCollapsed('[ApplePay Component] handleApplePayClick');
      console.log('[ApplePay Component] click context:', {
        isProcessing: this.isProcessing,
        disabled: this.disabled,
        isAvailable: this.isAvailable,
        canMakePayments: this.canMakePayments,
        hasService: Boolean(this.applePayService),
      });

      const paymentRequest: IApplePayPaymentRequest = {
        countryCode: this.countryCode,
        currencyCode: checkoutStore.paymentCurrency,
        merchantCapabilities: ApplePayHelpers.getDefaultMerchantCapabilities(),
        supportedNetworks: ApplePayHelpers.getDefaultSupportedNetworks(),
        total: ApplePayHelpers.createLineItem(
          checkoutStore.paymentDescription,
          checkoutStore.paymentAmount
        ),
      };

      console.log("[ApplePay Component] paymentRequest", paymentRequest);
      console.log('[ApplePay Component] identifiers snapshot:', {
        authTokenLength: checkoutStore.authToken ? String(checkoutStore.authToken).length : 0,
        accountId: checkoutStore.accountId,
      });

      const result = await this.applePayService.startPaymentSession(
        paymentRequest,
        checkoutStore.authToken,
        checkoutStore.accountId
      );

      console.log("[ApplePay Component] startPaymentSession result", result);

      if (result.success) {
        this.applePayCompleted.emit({
          success: true,
          token: result.token,
          paymentMethodId: result.paymentMethodId,
        });
      } else {
        this.applePayCompleted.emit({
          success: false,
          error: result.error,
        });
        this.applePayError.emit({
          error: result.error?.message || "Payment failed",
        });
      }
    } catch (error) {
      console.error("Apple Pay payment error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Payment failed";
      this.error = errorMessage;
      this.applePayError.emit({ error: errorMessage });
      this.applePayCompleted.emit({
        success: false,
        error: errorMessage,
      });
    } finally {
      this.isProcessing = false;
      console.groupEnd();
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
    this.applePayService.abortPaymentSession();
    this.isProcessing = false;
    this.applePayCancelled.emit();
  }

  render() {
    const isReady =
      !this.isLoading &&
      this.isAvailable &&
      this.canMakePayments &&
      this.isConfigValid;

    return (
      <StyledHost>
        {checkoutStore.checkoutLoaded && (
          <script
            async
            src='https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js'
            onLoad={() => {
              console.log('[ApplePay Component] Apple Pay SDK script loaded');
              this.initializeApplePay();
            }}
          ></script>
        )}
        <div class='apple-pay-container'>
          <ApplePaySkeleton isReady={isReady} />

          {isReady && (
            <ApplePayButton
              buttonType={this.buttonType}
              buttonStyle={this.buttonStyle}
              disabled={this.disabled}
              isProcessing={this.isProcessing}
              isAvailable={this.isAvailable}
              clickHandler={this.handleApplePayClick}
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
