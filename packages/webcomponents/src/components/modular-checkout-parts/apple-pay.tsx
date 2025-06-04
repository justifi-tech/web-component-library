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
import { ApplePayService } from "../../api/services/apple-pay.service";
import {
  IApplePayConfig,
  IApplePayPaymentRequest,
  ApplePayButtonType,
  ApplePayButtonStyle,
  ApplePayHelpers,
  ApplePayContactField,
} from "../../api/ApplePay";
import { StyledHost } from "../../ui-components";
import ApplePaySkeleton from "./apple-pay-skeleton";

@Component({
  tag: "justifi-apple-pay",
  shadow: true,
})
export class ApplePay {
  private applePayService: ApplePayService;

  @Prop() amount!: number;
  @Prop() currency: string = "USD";
  @Prop() countryCode: string = "US";
  @Prop() label: string = "Payment";
  @Prop() merchantIdentifier: string = "merchant.com.justifi.checkout";
  @Prop() merchantDisplayName: string = "JustiFi Checkout";
  @Prop() initiativeContext: string = "checkout.justifi.tech";
  @Prop() apiBaseUrl: string = "https://ahalaburda.zapto.org/api/v1";
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
    transactionId?: string;
    error?: any;
  }>;
  @Event() applePayCancelled: EventEmitter<void>;
  @Event() applePayError: EventEmitter<{ error: string }>;

  componentWillLoad() {
    this.applePayService = new ApplePayService();
    this.applePayService.setApiBaseUrl(this.apiBaseUrl);
    this.initializeApplePay();
  }

  @Watch("amount")
  @Watch("merchantIdentifier")
  @Watch("apiBaseUrl")
  @Watch("buttonType")
  @Watch("buttonStyle")
  @Watch("disabled")
  watchPropsChange() {
    if (this.applePayService) {
      this.applePayService.setApiBaseUrl(this.apiBaseUrl);
    }
    this.initializeApplePay();
  }

  private async initializeApplePay() {
    try {
      this.isLoading = true;
      this.error = null;

      if (!this.amount) {
        this.error = "Missing required Apple Pay configuration";
        this.isLoading = false;
        return;
      }

      // Check if we're running locally for testing
      const isLocalhost =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname.includes("localhost");

      if (isLocalhost) {
        // For local testing, bypass Apple Pay checks
        console.log(
          " Local testing mode: bypassing Apple Pay availability checks"
        );
        this.isAvailable = true;
        this.canMakePayments = true;
      } else {
        // Production: Check Apple Pay availability
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
      }

      const applePayConfig: IApplePayConfig = {
        merchantIdentifier: this.merchantIdentifier,
        displayName: this.merchantDisplayName,
        initiative: "web",
        initiativeContext: this.initiativeContext,
        buttonType: this.buttonType,
        buttonStyle: this.buttonStyle,
      };

      this.applePayService.initialize(applePayConfig);

      // Only check for active card if we can make payments (and not in local testing)
      if (this.canMakePayments && !isLocalhost) {
        const hasActiveCard =
          await this.applePayService.canMakePaymentsWithActiveCard();
        if (!hasActiveCard) {
          console.warn("No Apple Pay cards available, but continuing...");
        }
      } else if (isLocalhost) {
        console.log("Skipping active card check in local testing mode");
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
        currencyCode: this.currency,
        merchantCapabilities: ApplePayHelpers.getDefaultMerchantCapabilities(),
        supportedNetworks: ApplePayHelpers.getDefaultSupportedNetworks(),
        total: ApplePayHelpers.createLineItem(this.label, this.amount),
        requiredBillingContactFields: [
          ApplePayContactField.POSTAL_ADDRESS,
          ApplePayContactField.EMAIL,
          ApplePayContactField.NAME,
        ],
      };

      const result =
        await this.applePayService.startPaymentSession(paymentRequest);

      if (result.success) {
        this.applePayCompleted.emit({
          success: true,
          transactionId: result.transactionId,
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
    // Check if we're running locally for testing
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname.includes("localhost");

    if (isLocalhost) {
      console.log("🧪 Local testing mode: reporting Apple Pay as supported");
      return true;
    }

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

  private getButtonClasses(): string {
    let classes = "apple-pay-button";

    if (this.disabled || this.isProcessing || !this.isAvailable) {
      classes += " disabled";
    }

    return classes;
  }

  render() {
    const isReady =
      !this.isLoading &&
      this.isAvailable &&
      this.canMakePayments &&
      !this.error;

    console.log("is loading?", this.isLoading);
    console.log("is error?", this.error);
    console.log("is available?", this.isAvailable);
    console.log("can make payments?", this.canMakePayments);

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
              <button
                class={this.getButtonClasses()}
                onClick={this.handleApplePayClick}
                disabled={
                  this.disabled || this.isProcessing || !this.isAvailable
                }
                aria-label='Pay with Apple Pay'
                type='button'
              >
                {this.isProcessing ? (
                  <div class='processing'>
                    <div class='spinner'></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Pay with Apple Pay"
                )}
              </button>
            )}
        </div>

        <style>
          {`
            .apple-pay-container {
              width: 100%;
            }

            .apple-pay-button {
              width: 200px;
              height: 48px;
              background-color: #000;
              color: #fff;
              border: none;
              border-radius: 8px;
              font-size: 16px;
              font-weight: 500;
              cursor: pointer;
              transition: opacity 0.2s ease;
            }

            .apple-pay-button:hover:not(.disabled) {
              opacity: 0.9;
            }

            .apple-pay-button.disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }

            .processing {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
            }

            .spinner {
              width: 16px;
              height: 16px;
              border: 2px solid rgba(255, 255, 255, 0.3);
              border-top: 2px solid #fff;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }

            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
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
