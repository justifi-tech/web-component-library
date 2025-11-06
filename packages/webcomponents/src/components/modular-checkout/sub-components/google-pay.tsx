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
import { PAYMENT_METHODS } from "../ModularCheckout";

@Component({
  tag: "justifi-google-pay",
  shadow: true,
})
export class GooglePay {
  private googlePayService: GooglePayService;

  @State() canMakePayments: boolean = false;
  @State() error: string | null = null;
  @State() isAvailable: boolean = false;
  @State() isLoading: boolean = true;
  @State() isProcessing: boolean = false;

  @Prop() buttonSizeMode: GooglePayButtonSizeMode = GooglePayButtonSizeMode.FILL;
  @Prop() buttonStyle: GooglePayButtonStyle = GooglePayButtonStyle.BLACK;
  @Prop() buttonType: GooglePayButtonType = GooglePayButtonType.PLAIN;
  @Prop() countryCode: string = "US";
  @Prop() disabled: boolean = false;
  @Prop() environment: GooglePayEnvironment = GooglePayEnvironment.TEST;
  @Prop() merchantId: string = "gateway:justifi";
  @Prop() merchantName: string = "justifi";
  @Prop() showSkeleton: boolean = true;

  @Watch("merchantId")
  @Watch("environment")
  @Watch("buttonType")
  @Watch("buttonStyle")
  @Watch("buttonSizeMode")
  @Watch("disabled")
  watchPropsChange() {
    this.initializeGooglePay();
  }

  @Event() googlePayCancelled: EventEmitter<void>;
  @Event() googlePayCompleted: EventEmitter<{
    success: boolean;
    paymentData?: IGooglePayPaymentData;
    paymentMethodId?: string;
    error?: any;
  }>;
  @Event() googlePayError: EventEmitter<{ error: string }>;
  @Event() googlePayStarted: EventEmitter<void>;

  componentWillLoad() {
    this.googlePayService = new GooglePayService();
    this.initializeGooglePay();
  }

  componentDidLoad() {
    onChange("paymentAmount", () => {
      this.initializeGooglePay();
    });
  }

  @Method()
  async getAuthMethods(): Promise<string[]> {
    if (!this.isAvailable) {
      return [];
    }
    return GooglePayHelpers.getDefaultAuthMethods();
  }

  @Method()
  async getPaymentMethods(): Promise<string[]> {
    if (!this.isAvailable) {
      return [];
    }
    return GooglePayHelpers.getDefaultSupportedNetworks();
  }

  @Method()
  async handleSelectionClick(): Promise<void> {
    checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.GOOGLE_PAY };
  }

  @Method()
  async isSupported(): Promise<boolean> {
    return this.isAvailable && this.canMakePayments;
  }

  @Method()
  async prefetchPaymentData(): Promise<void> {
    if (!this.isAvailable || !this.canMakePayments) {
      return;
    }

    const paymentDataRequest = this.createPaymentDataRequest();
    this.googlePayService.prefetchPaymentData(paymentDataRequest);
  }

  private async initializeGooglePay() {
    try {
      this.isLoading = true;
      this.error = null;

      if (!checkoutStore.paymentAmount) {
        this.error = "Missing required Google Pay configuration";
        this.isLoading = false;
        return;
      }

      this.isAvailable = GooglePayHelpers.isGooglePaySupported();

      if (!this.isAvailable) {
        await this.waitForGooglePay(3000);
        this.isAvailable = GooglePayHelpers.isGooglePaySupported();
        if (!this.isAvailable) {
          this.error = "Google Pay is not supported on this device";
          this.isLoading = false;
          return;
        }
      }

      const googlePayConfig: IGooglePayConfig = {
        environment: this.environment,
        merchantId: this.merchantId,
        merchantName: this.merchantName,
        buttonType: this.buttonType,
        buttonStyle: this.buttonStyle,
        buttonSizeMode: this.buttonSizeMode,
      };

      this.googlePayService.initialize(googlePayConfig);

      this.canMakePayments = await this.googlePayService.canMakePayments();

      if (!this.canMakePayments) {
        this.error = "Google Pay is not available for payments";
        this.isLoading = false;
        return;
      }

      const paymentDataRequest = this.createPaymentDataRequest();
      this.googlePayService.prefetchPaymentData(paymentDataRequest);
    } catch (error) {
      this.error =
        error instanceof Error
          ? error.message
          : "Failed to initialize Google Pay";
    } finally {
      this.isLoading = false;
    }
  }

  private createPaymentDataRequest(): IGooglePayPaymentDataRequest {
    return GooglePayService.createPaymentDataRequest(
      checkoutStore.paymentAmount,
      checkoutStore.paymentDescription,
      this.countryCode,
      checkoutStore.paymentCurrency,
      this.merchantName,
    );
  }

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

      const paymentDataRequest = this.createPaymentDataRequest();
      const result =
        await this.googlePayService.startPaymentSession(
          paymentDataRequest,
          checkoutStore.authToken,
          checkoutStore.accountId
        );

      if (result.success) {
        this.googlePayCompleted.emit({
          success: true,
          paymentData: result.paymentData,
          paymentMethodId: result.paymentMethodId,
        });
      } else {
        this.googlePayCompleted.emit({
          success: false,
          error: result.error,
        });

        if (result.error?.code === "USER_CANCELLED") {
          this.googlePayCancelled.emit();
        } else {
          this.googlePayError.emit({
            error: result.error?.message || "Payment failed",
          });
        }
      }
    } catch (error) {
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

  private waitForGooglePay(timeoutMs: number = 3000): Promise<void> {
    return new Promise((resolve) => {
      const start = Date.now();
      const check = () => {
        if (GooglePayHelpers.isGooglePaySupported()) {
          resolve();
          return;
        }
        if (Date.now() - start > timeoutMs) {
          resolve();
          return;
        }
        setTimeout(check, 50);
      };
      check();
    });
  }

  render() {
    return (
      <StyledHost>
        {checkoutStore.checkoutLoaded && (
          <script
            async
            src='https://pay.google.com/gp/p/js/pay.js'
            onLoad={() => {
              this.initializeGooglePay();
            }}
          ></script>
        )}
        <div class='google-pay-container'>
          <GooglePaySkeleton isLoading={this.isLoading} />

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
