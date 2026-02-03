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
export class GooglePay {
  private iframeElement: HTMLIFrameElement;

  @Prop() environment: "TEST" | "PRODUCTION" = "TEST";
  @Prop() merchantId?: string;
  @Prop() merchantName?: string;

  @State() iframeOrigin: string;
  @State() iframeReady: boolean = false;
  @State() sdkLoaded: boolean = false;
  @State() isReadyToPay: boolean = false;

  @Event() googlePayCompleted: EventEmitter<{
    success: boolean;
    paymentMethodId?: string;
    cardNetwork?: string;
    cardDetails?: string;
    error?: { code: string; message: string };
  }>;
  @Event() googlePayCancelled: EventEmitter<void>;

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
        this.sendStartPayment();
        break;
      case GooglePayEventTypes.paymentSuccess:
        this.googlePayCompleted.emit({
          success: true,
          paymentMethodId: data.paymentMethodId,
          cardNetwork: data.cardNetwork,
          cardDetails: data.cardDetails,
        });
        break;
      case GooglePayEventTypes.paymentCanceled:
        this.googlePayCancelled.emit();
        break;
      case GooglePayEventTypes.paymentError:
        this.googlePayCompleted.emit({
          success: false,
          error: { code: data.code, message: data.message },
        });
        break;
    }
  };

  private sendInitialize() {
    if (!this.iframeElement?.contentWindow) return;

    const config = {
      environment: this.environment,
      gatewayMerchantId: checkoutStore.accountId,
      merchantId: this.merchantId,
      merchantName: this.merchantName,
      authToken: checkoutStore.authToken,
      accountId: checkoutStore.accountId,
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
