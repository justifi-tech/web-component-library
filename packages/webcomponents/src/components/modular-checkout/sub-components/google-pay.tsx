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
import { GooglePayService } from "../../../api/services/google-pay.service";
import {
  IGooglePayConfig,
  IGooglePayPaymentDataRequest,
  GooglePayButtonType,
  GooglePayButtonStyle,
  GooglePayButtonSizeMode,
  GooglePayEnvironment,
  GooglePayHelpers,
  IGooglePayPaymentData,
} from "../../../api/GooglePay";
import { StyledHost } from "../../../ui-components";
import GooglePaySkeleton from "./google-pay-skeleton";
import { GooglePayButton } from "../../../ui-components/google-pay-button";
import { checkoutStore, onChange } from "../../../store/checkout.store";

@Component({
  tag: "justifi-google-pay",
  shadow: true,
})
export class GooglePay {
  private googlePayService: GooglePayService;
  @Prop() countryCode: string = "US";
  @Prop() environment: GooglePayEnvironment = GooglePayEnvironment.TEST;
  @Prop() merchantId?: string;
  @Prop() merchantName: string = "JustiFi Checkout";
  @Prop() gatewayMerchantId: string = "";
  @Prop() gateway: string = "example";
  @Prop() apiBaseUrl: string = "https://ahalaburda.zapto.org/api/v1";
  @Prop() buttonType: GooglePayButtonType = GooglePayButtonType.PLAIN;
  @Prop() buttonStyle: GooglePayButtonStyle = GooglePayButtonStyle.BLACK;
  @Prop() buttonSizeMode: GooglePayButtonSizeMode =
    GooglePayButtonSizeMode.STATIC;
  @Prop() disabled: boolean = false;
  @Prop() showSkeleton: boolean = true;

  @State() isLoading: boolean = true;
  @State() isProcessing: boolean = false;
  @State() isAvailable: boolean = false;
  @State() canMakePayments: boolean = false;
  @State() error: string | null = null;

  @Event() googlePayStarted: EventEmitter<void>;
  @Event() googlePayCompleted: EventEmitter<{
    success: boolean;
    paymentData?: IGooglePayPaymentData;
    error?: any;
  }>;
  @Event() googlePayCancelled: EventEmitter<void>;
  @Event() googlePayError: EventEmitter<{ error: string }>;

  componentWillLoad() {
    this.googlePayService = new GooglePayService();
    this.googlePayService.setApiBaseUrl(this.apiBaseUrl);
    this.initializeGooglePay();
  }

  componentDidLoad() {
    onChange("paymentAmount", () => {
      this.initializeGooglePay();
    });
  }

  @Watch("merchantId")
  @Watch("gatewayMerchantId")
  @Watch("gateway")
  @Watch("environment")
  @Watch("apiBaseUrl")
  @Watch("buttonType")
  @Watch("buttonStyle")
  @Watch("buttonSizeMode")
  @Watch("disabled")
  watchPropsChange() {
    if (this.googlePayService) {
      this.googlePayService.setApiBaseUrl(this.apiBaseUrl);
    }
    this.initializeGooglePay();
  }

  /**
   * Initialize Google Pay service and check availability
   */
  private async initializeGooglePay() {
    try {
      this.isLoading = true;
      this.error = null;

      if (!checkoutStore.paymentAmount) {
        this.error = "Missing required Google Pay configuration";
        this.isLoading = false;
        return;
      }

      if (!this.gatewayMerchantId) {
        this.error = "Gateway merchant ID is required";
        this.isLoading = false;
        return;
      }

      this.isAvailable = GooglePayHelpers.isGooglePaySupported();

      if (!this.isAvailable) {
        this.error = "Google Pay is not supported on this device";
        this.isLoading = false;
        return;
      }

      const googlePayConfig: IGooglePayConfig = {
        environment: this.environment,
        merchantId: this.merchantId,
        merchantName: this.merchantName,
        gatewayMerchantId: this.gatewayMerchantId,
        gateway: this.gateway,
        buttonType: this.buttonType,
        buttonStyle: this.buttonStyle,
        buttonSizeMode: this.buttonSizeMode,
      };

      this.googlePayService.initialize(googlePayConfig);

      // Check if payments can be made
      this.canMakePayments = await this.googlePayService.canMakePayments();

      if (!this.canMakePayments) {
        this.error = "Google Pay is not available for payments";
        this.isLoading = false;
        return;
      }

      // Prefetch payment data for faster loading
      const paymentDataRequest = this.createPaymentDataRequest();
      this.googlePayService.prefetchPaymentData(paymentDataRequest);
    } catch (error) {
      console.error("Google Pay initialization error:", error);
      this.error =
        error instanceof Error
          ? error.message
          : "Failed to initialize Google Pay";
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Create payment data request for Google Pay
   */
  private createPaymentDataRequest(): IGooglePayPaymentDataRequest {
    return GooglePayService.createPaymentDataRequest(
      checkoutStore.paymentAmount,
      checkoutStore.paymentDescription,
      this.countryCode,
      checkoutStore.paymentCurrency,
      this.gateway,
      this.gatewayMerchantId,
      this.merchantName,
      this.merchantId
    );
  }

  /**
   * Handle Google Pay button click
   */
  private handleGooglePayClick = async () => {
    if (
      this.isProcessing ||
      this.disabled ||
      !this.isAvailable ||
      !this.canMakePayments
    ) {
      return;
    }

    try {
      this.isProcessing = true;
      this.error = null;
      this.googlePayStarted.emit();
      console.log("Payment data request:", {
        paymentAmount: checkoutStore.paymentAmount,
        paymentDescription: checkoutStore.paymentDescription,
        paymentCurrency: checkoutStore.paymentCurrency,
        gatewayMerchantId: this.gatewayMerchantId,
      });

      const paymentDataRequest = this.createPaymentDataRequest();
      const result =
        await this.googlePayService.startPaymentSession(paymentDataRequest);

      if (result.success) {
        this.googlePayCompleted.emit({
          success: true,
          paymentData: result.paymentData,
        });
      } else {
        this.googlePayCompleted.emit({
          success: false,
          error: result.error,
        });

        // Handle user cancellation differently
        if (result.error?.code === "USER_CANCELLED") {
          this.googlePayCancelled.emit();
        } else {
          this.googlePayError.emit({
            error: result.error?.message || "Payment failed",
          });
        }
      }
    } catch (error) {
      console.error("Google Pay payment error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Payment failed";
      this.error = errorMessage;
      this.googlePayError.emit({ error: errorMessage });
      this.googlePayCompleted.emit({
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
    return GooglePayHelpers.getDefaultSupportedNetworks();
  }

  @Method()
  async getAuthMethods(): Promise<string[]> {
    if (!this.isAvailable) {
      return [];
    }
    return GooglePayHelpers.getDefaultAuthMethods();
  }

  @Method()
  async prefetchPaymentData(): Promise<void> {
    if (!this.isAvailable || !this.canMakePayments) {
      return;
    }

    const paymentDataRequest = this.createPaymentDataRequest();
    this.googlePayService.prefetchPaymentData(paymentDataRequest);
  }

  render() {
    const isReady =
      !this.isLoading &&
      this.isAvailable &&
      this.canMakePayments &&
      !this.error;

    return (
      <StyledHost>
        <div class='google-pay-container'>
          <GooglePaySkeleton isReady={isReady} />

          {!this.isLoading && this.error && (
            <div class='google-pay-error' role='alert'>
              <span class='error-icon'>⚠️</span>
              <span class='error-message'>{this.error}</span>
            </div>
          )}

          {!this.isLoading && !this.error && !this.isAvailable && (
            <div class='google-pay-unavailable'>
              <span class='unavailable-message'>
                Google Pay is not available on this device
              </span>
            </div>
          )}

          {!this.isLoading &&
            !this.error &&
            this.isAvailable &&
            !this.canMakePayments && (
              <div class='google-pay-unavailable'>
                <span class='unavailable-message'>
                  Google Pay is not available for payments
                </span>
              </div>
            )}

          {!this.isLoading &&
            !this.error &&
            this.isAvailable &&
            this.canMakePayments && (
              <GooglePayButton
                buttonType={this.buttonType}
                buttonStyle={this.buttonStyle}
                buttonSizeMode={this.buttonSizeMode}
                disabled={this.disabled}
                isProcessing={this.isProcessing}
                isAvailable={this.isAvailable}
                clickHandler={this.handleGooglePayClick}
              />
            )}
        </div>

        <style>
          {`
            .google-pay-container {
              width: 100%;
            }

            .google-pay-error {
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

            .google-pay-unavailable {
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
