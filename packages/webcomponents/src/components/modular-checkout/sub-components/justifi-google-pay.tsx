import {
  Component,
  Event,
  EventEmitter,
  h,
  Host,
  Prop,
  State,
} from "@stencil/core";
import { configState, waitForConfig } from "../../config-provider/config-state";
import { checkoutStore } from "../../../store/checkout.store";
import GooglePaySkeleton from "./google-pay-skeleton";
import { emitPublic } from '../../../api/emit-public';
import { PAYMENT_METHODS, SelectedPaymentMethod } from '../ModularCheckout';

enum GooglePayEventTypes {
  initialize = "justifi.googlePay.initialize",
  ready = "justifi.googlePay.ready",
  sdkLoaded = "justifi.googlePay.sdkLoaded",
  initializeResult = "justifi.googlePay.initializeResult",
  error = "justifi.googlePay.error",
  buttonClicked = "justifi.googlePay.buttonClicked",
  startPayment = "justifi.googlePay.startPayment",
  paymentSuccess = "justifi.googlePay.paymentSuccess",
  paymentCanceled = "justifi.googlePay.paymentCanceled",
  paymentError = "justifi.googlePay.paymentError",
}

@Component({
  tag: "justifi-google-pay",
  shadow: true,
})
export class JustifiGooglePay {
  private iframeElement: HTMLIFrameElement;

  /** If not provided, the environment will be determined by the account mode: 'test' or 'live'. */
  @Prop() environment?: "TEST" | "PRODUCTION";
  @Prop() merchantDisplayName: string = "JustiFi Checkout";
  /** Set to true when embedding inside an Android WebView so the iframe uses the
   * W3C Payment Request API (native Google Pay sheet) instead of pay.js's
   * loadPaymentData popup, which Google blocks in WebViews (OR_BIBED_15). */
  @Prop() useNativePaymentRequest: boolean = false;

  @State() iframeOrigin: string;
  @State() iframeReady: boolean = false;
  @State() sdkLoaded: boolean = false;
  @State() isReadyToPay: boolean = false;

  @Event({ eventName: 'justifi-payment-method-selected', bubbles: true })
  paymentMethodSelected: EventEmitter<SelectedPaymentMethod>;
  /** @deprecated Listen for `justifi-payment-method-selected`. Removed in the next major. */
  @Event({ eventName: 'paymentMethodOptionSelected', bubbles: true })
  paymentMethodSelectedLegacy: EventEmitter<SelectedPaymentMethod>;
  @Event({ eventName: 'justifi-google-pay-started' }) googlePayStarted: EventEmitter<void>;
  /** @deprecated Listen for `justifi-google-pay-started`. Removed in the next major. */
  @Event({ eventName: 'googlePayStarted' }) googlePayStartedLegacy: EventEmitter<void>;
  @Event({ eventName: 'justifi-google-pay-completed' }) googlePayCompleted: EventEmitter<{
    success: boolean;
    paymentMethodId?: string;
    cardNetwork?: string;
    cardDetails?: string;
    error?: { code: string; message: string };
  }>;
  /** @deprecated Listen for `justifi-google-pay-completed`. Removed in the next major. */
  @Event({ eventName: 'googlePayCompleted' }) googlePayCompletedLegacy: EventEmitter<{
    success: boolean;
    paymentMethodId?: string;
    cardNetwork?: string;
    cardDetails?: string;
    error?: { code: string; message: string };
  }>;
  @Event({ eventName: 'justifi-google-pay-cancelled' }) googlePayCancelled: EventEmitter<void>;
  /** @deprecated Listen for `justifi-google-pay-cancelled`. Removed in the next major. */
  @Event({ eventName: 'googlePayCancelled' }) googlePayCancelledLegacy: EventEmitter<void>;

  async componentWillLoad() {
    await waitForConfig();
    this.iframeOrigin = configState.iframeOrigin;
  }

  componentDidLoad() {
    window.addEventListener("message", this.handleMessage);
  }

  disconnectedCallback() {
    window.removeEventListener("message", this.handleMessage);
  }

  private handleMessage = (event: MessageEvent) => {
    if (event.origin !== this.iframeOrigin) return;

    const { eventType, data } = event.data || {};

    switch (eventType) {
      case GooglePayEventTypes.ready:
        this.iframeReady = true;
        break;
      case GooglePayEventTypes.sdkLoaded:
        this.sdkLoaded = true;
        this.sendInitialize();
        break;
      case GooglePayEventTypes.initializeResult:
        this.isReadyToPay = data.isReadyToPay;
        if (data.error) console.error("Init error:", data.error);
        break;
      case GooglePayEventTypes.error:
        console.error("Google Pay error:", data);
        break;
      case GooglePayEventTypes.buttonClicked:
        emitPublic(this.googlePayStarted, this.googlePayStartedLegacy);
        emitPublic(this.paymentMethodSelected, this.paymentMethodSelectedLegacy, {
          type: PAYMENT_METHODS.GOOGLE_PAY,
        });
        this.sendStartPayment();
        break;
      case GooglePayEventTypes.paymentSuccess:
        emitPublic(this.googlePayCompleted, this.googlePayCompletedLegacy, {
          success: true,
          paymentMethodId: data.paymentMethodId,
          cardNetwork: data.cardNetwork,
          cardDetails: data.cardDetails,
        });
        break;
      case GooglePayEventTypes.paymentCanceled:
        emitPublic(this.googlePayCancelled, this.googlePayCancelledLegacy);
        break;
      case GooglePayEventTypes.paymentError:
        emitPublic(this.googlePayCompleted, this.googlePayCompletedLegacy, {
          success: false,
          error: { code: data.code, message: data.message },
        });
        break;
    }
  };

  private googlePayEnvironment(): "TEST" | "PRODUCTION" {
    if (this.environment !== undefined) {
      return this.environment;
    }
    return checkoutStore.checkoutMode === "test" ? "TEST" : "PRODUCTION";
  }

  private sendInitialize() {
    if (!this.iframeElement?.contentWindow) return;

    const config = {
      environment: this.googlePayEnvironment(),
      gatewayMerchantId: checkoutStore.accountId,
      merchantName: this.merchantDisplayName,
      authToken: checkoutStore.authToken,
      accountId: checkoutStore.accountId,
      useNativePaymentRequest: this.useNativePaymentRequest,
    };

    this.iframeElement.contentWindow.postMessage(
      {
        eventType: GooglePayEventTypes.initialize,
        data: config,
      },
      this.iframeOrigin,
    );
  }

  private sendStartPayment() {
    if (!this.iframeElement?.contentWindow) return;

    const transactionInfo = {
      totalPrice: String(checkoutStore.paymentAmount / 100),
      totalPriceStatus: "FINAL",
      currencyCode: checkoutStore.paymentCurrency || "USD",
    };

    this.iframeElement.contentWindow.postMessage(
      {
        eventType: GooglePayEventTypes.startPayment,
        data: transactionInfo,
      },
      this.iframeOrigin,
    );
  }

  render() {
    if (!checkoutStore.checkoutLoaded) {
      return null;
    }
    if (!checkoutStore.googlePayEnabled) {
      console.warn("Google Pay is not enabled for this checkout");
      return null;
    }

    return (
      <Host>
        <GooglePaySkeleton isLoading={!this.isReadyToPay} />
        <iframe
          ref={(el) => (this.iframeElement = el)}
          src={`${this.iframeOrigin}/v2/googlePay`}
          allow="payment"
          style={{
            border: "none",
            width: "100%",
            height: "48px",
            display: this.isReadyToPay ? "block" : "none",
          }}
        />
      </Host>
    );
  }
}
