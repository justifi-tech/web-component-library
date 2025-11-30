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
  IGooglePayError,
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
  private unsubscribes: Array<() => void> = [];

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
  watchConfigChange() {
    this.initializeGooglePay();
  }

  @Event() googlePayCancelled: EventEmitter<void>;
  /**
   * Emitted when Google Pay flow completes. On failure, `success=false` and `error` is populated.
   */
  @Event() googlePayCompleted: EventEmitter<{
    success: boolean;
    paymentData?: IGooglePayPaymentData;
    paymentMethodId?: string;
    error?: IGooglePayError | string;
  }>;
  @Event() googlePayStarted: EventEmitter<void>;

  componentWillLoad() {
    this.googlePayService = new GooglePayService();
  }

  componentDidLoad() {
    const unsub = onChange("paymentAmount", () => {
      this.prefetchPaymentData();
    });
    if (typeof unsub === 'function') this.unsubscribes.push(unsub);

    const unsubCurrency = onChange("paymentCurrency", () => {
      this.prefetchPaymentData();
    });
    if (typeof unsubCurrency === 'function') this.unsubscribes.push(unsubCurrency);

    const unsubDesc = onChange("paymentDescription", () => {
      this.prefetchPaymentData();
    });
    if (typeof unsubDesc === 'function') this.unsubscribes.push(unsubDesc);
  }

  disconnectedCallback() {
    this.unsubscribes.forEach((fn) => {
      try { fn(); } catch { }
    });
    this.unsubscribes = [];
  }

  /**
   * Returns supported authentication methods when Google Pay is available.
   */
  @Method()
  async getSupportedAuthMethods(): Promise<string[]> {
    if (!this.isAvailable) {
      return [];
    }
    return GooglePayHelpers.getDefaultAuthMethods();
  }


  /**
   * Returns supported card networks when Google Pay is available.
   */
  @Method()
  async getSupportedNetworks(): Promise<string[]> {
    if (!this.isAvailable) {
      return [];
    }
    return GooglePayHelpers.getDefaultSupportedNetworks();
  }


  /**
   * Select Google Pay in the modular checkout parent.
   */
  @Method()
  async handleSelectionClick(): Promise<void> {
    checkoutStore.selectedPaymentMethod = { type: PAYMENT_METHODS.GOOGLE_PAY };
  }

  /**
   * Returns whether Google Pay is both available and can make payments.
   */
  @Method()
  async isSupported(): Promise<boolean> {
    return this.isAvailable && this.canMakePayments;
  }

  /**
   * Prefetch payment data for faster load times of the Google Pay sheet.
   */
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

      const googlePayConfig: IGooglePayConfig = {
        environment: this.environment,
        merchantId: this.merchantId,
        merchantName: this.merchantName,
        buttonType: this.buttonType,
        buttonStyle: this.buttonStyle,
        buttonSizeMode: this.buttonSizeMode,
      };

      this.googlePayService.initialize(googlePayConfig);

      this.isAvailable = this.googlePayService.isAvailable();

      if (!this.isAvailable) {
        this.error = "Google Pay is not supported on this device";
        this.isLoading = false;
        return;
      }

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
          // Error will be conveyed via googlePayCompleted with success:false
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Payment failed";
      this.error = errorMessage;
      this.googlePayCompleted.emit({
        success: false,
        error: errorMessage,
      });
    } finally {
      this.isProcessing = false;
    }
  };



  render() {
    const showError = !this.isLoading && !!this.error;
    const showDeviceUnavailable = !this.isLoading && !this.error && !this.isAvailable;
    const showPaymentsUnavailable =
      !this.isLoading && !this.error && this.isAvailable && !this.canMakePayments;
    const showButton =
      !this.isLoading && !this.error && this.isAvailable && this.canMakePayments;

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

          {showError && (
            <div class='google-pay-error' role='alert' data-testid='gp-error'>
              <span class='error-icon'>⚠️</span>
              <span class='error-message'>{this.error}</span>
            </div>
          )}

          {showDeviceUnavailable && (
            <div class='google-pay-unavailable' data-testid='gp-device-unavailable'>
              <span class='unavailable-message'>
                Google Pay is not available on this device
              </span>
            </div>
          )}

          {showPaymentsUnavailable && (
            <div class='google-pay-unavailable' data-testid='gp-payments-unavailable'>
              <span class='unavailable-message'>
                Google Pay is not available for payments
              </span>
            </div>
          )}

          {showButton && (
            <GooglePayButton
              data-testid='gp-button'
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
