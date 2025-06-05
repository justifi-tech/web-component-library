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
import { ApplePayButton } from "../../ui-components/apple-pay-button";

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
  @Prop() billingContact: string;

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

    let billingContactData = null;
    if (this.billingContact) {
      try {
        billingContactData = JSON.parse(this.billingContact);
        console.log("Using billing contact for Apple Pay:", billingContactData);
      } catch (error) {
        console.error("Failed to parse billing contact:", error);
      }
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
        billingContact: billingContactData,
      };

      const result =
        await this.applePayService.startPaymentSession(paymentRequest);

      if (result.success) {
        this.applePayCompleted.emit({
          success: true,
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
