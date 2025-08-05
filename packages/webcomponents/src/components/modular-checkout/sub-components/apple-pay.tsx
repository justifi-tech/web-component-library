import {
  Component,
  h,
  Prop,
  State,
  Event,
  EventEmitter,
  Method,
  Watch,
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
import { checkoutStore, onChange } from "../../../store/checkout.store";

@Component({
  tag: "justifi-apple-pay",
  shadow: true,
})
export class ApplePay {
  private applePayService: ApplePayService;
  @Prop() countryCode: string = "US";
  @Prop() merchantIdentifier: string = "merchant.com.staging-justifi.checkout-dev";
  @Prop() merchantDisplayName: string = "JustiFi Checkout";
  @Prop() initiativeContext: string = "dev-checkout.justifi-staging.com";
  @Prop() apiBaseUrl: string = "https://api.justifi-staging.com";
  @Prop() buttonType: ApplePayButtonType = ApplePayButtonType.PLAIN;
  @Prop() buttonStyle: ApplePayButtonStyle = ApplePayButtonStyle.BLACK;
  @Prop() disabled: boolean = false;
  @Prop() showSkeleton: boolean = true;

  @State() isLoading: boolean = true;
  @State() isProcessing: boolean = false;
  @State() isAvailable: boolean = false;
  @State() canMakePayments: boolean = false;
  @State() error: string | null = null;

  @Event() applePayStarted: EventEmitter<void>;
  @Event() applePayCompleted: EventEmitter<{
    success: boolean;
    token?: IApplePayToken;
    error?: any;
  }>;
  @Event() applePayCancelled: EventEmitter<void>;
  @Event() applePayError: EventEmitter<{ error: string }>;

  componentWillLoad() {
    this.applePayService = new ApplePayService();
    this.applePayService.setApiBaseUrl(this.apiBaseUrl);
    this.applePayService.setAuthToken(checkoutStore.authToken);
    this.applePayService.setAccountId(checkoutStore.accountId)
    this.initializeApplePay();
  }

  componentDidLoad() {
    onChange('paymentAmount', () => {
      this.initializeApplePay();
    });

    onChange('authToken', () => {
      if (this.applePayService) {
        this.applePayService.setAuthToken(checkoutStore.authToken);
      }
    });
  }

  @Watch("merchantIdentifier")
  @Watch("apiBaseUrl")
  @Watch("buttonType")
  @Watch("buttonStyle")
  @Watch("disabled")
  watchPropsChange() {
    if (this.applePayService) {
      this.applePayService.setApiBaseUrl(this.apiBaseUrl);
      this.applePayService.setAuthToken(checkoutStore.authToken);
    }
    this.initializeApplePay();
  }

  private async initializeApplePay() {
    try {
      this.isLoading = true;
      this.error = null;
      if (!checkoutStore.paymentAmount) {
        this.error = "Missing required Apple Pay configuration";
        this.isLoading = false;
        return;
      }

      this.isAvailable = ApplePayHelpers.isApplePaySupported();
      this.canMakePayments = ApplePayHelpers.canMakePayments();

      if (!this.isAvailable) {
        this.error = "Apple Pay is not supported on this device";
        this.isLoading = false;
        return;
      }

      if (!this.canMakePayments) {
        this.error = "Apple Pay is not available";
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

      this.applePayService.setAccountId(checkoutStore.accountId)
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
      this.applePayStarted.emit();

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

      const result =
        await this.applePayService.startPaymentSession(paymentRequest);

      if (result.success) {
        this.applePayCompleted.emit({
          success: true,
          token: result.token,
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
      !this.error;

    return (
      <StyledHost>
        <div class='apple-pay-container'>
          <ApplePaySkeleton isReady={isReady} />

          {!this.isLoading && this.error && (
            <div class='apple-pay-error' role='alert'>
              <span class='error-icon'>⚠️</span>
              <span class='error-message'>{this.error}</span>
            </div>
          )}

          {!this.isLoading && !this.error && !this.isAvailable && (
            <div class='apple-pay-unavailable'>
              <span class='unavailable-message'>
                Apple Pay is not available on this device
              </span>
            </div>
          )}

          {!this.isLoading &&
            !this.error &&
            this.isAvailable &&
            this.canMakePayments && (
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

            .apple-pay-error {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 12px;
              background: #fef2f2;
              border: 1px solid #fecaca;
              border-radius: 8px;
              color: #dc2626;
              font-size: 14px;
            }

            .apple-pay-unavailable {
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 12px;
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              color: #6b7280;
              font-size: 14px;
            }

            .error-icon {
              font-size: 16px;
            }
          `}
        </style>
      </StyledHost>
    );
  }
}
