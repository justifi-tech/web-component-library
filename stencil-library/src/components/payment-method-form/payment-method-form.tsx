import { Component, Event, Host, Prop, h, EventEmitter, Method, State } from '@stencil/core';

enum DispatchedEventTypes {
  blur = 'blur',
  change = 'change',
  ready = 'ready',
  tokenize = 'tokenize',
  resize = 'resize'
}

@Component({
  tag: 'justifi-payment-method-form',
  styleUrl: 'payment-method-form.css',
  shadow: false,
})
export class PaymentMethodForm {
  @Prop() iframeOrigin: string;
  @Event({ bubbles: true }) paymentMethodFormReady: EventEmitter;
  @Event({ bubbles: true }) paymentMethodFormChange: EventEmitter;
  @Event({ bubbles: true }) paymentMethodFormBlur: EventEmitter;
  @Event({ bubbles: true }) paymentMethodFormTokenize: EventEmitter<{ data: any }>;
  @Event({ bubbles: true }) paymentMethodFormResize: EventEmitter<{ data: any }>;
  @State() height: number = 55;

  iframeElement!: HTMLIFrameElement;

  connectedCallback() {
    window.addEventListener('message', this.dispatchMessageEvent.bind(this));
  }

  disconnectedCallback() {
    window.removeEventListener('message', this.dispatchMessageEvent.bind(this));
  }

  private dispatchMessageEvent(messageEvent: MessageEvent) {
    const messagePayload = messageEvent.data;
    const messageType = messagePayload.eventType;
    const messageData = messagePayload.data;

    switch (messageType) {
      case DispatchedEventTypes.ready:
        this.paymentMethodFormReady.emit(messageData);
        break;
      case DispatchedEventTypes.change:
        this.paymentMethodFormChange.emit(messageData);
        break;
      case DispatchedEventTypes.blur:
        this.paymentMethodFormBlur.emit(messageData);
        break;
      case DispatchedEventTypes.resize:
        this.handleResize(messageData);
        break;
      default:
        break;
    }
  }

  private handleResize(messageData) {
    console.log('messageData', messageData);
    this.height = messageData.height;
  }

  private triggerTokenization(
    clientKey: string,
    paymentMethodMetadata: any,
    account?: string
  ) {
    if (this.iframeElement && this.iframeElement.contentWindow) {
      this.iframeElement.contentWindow.postMessage({
        eventType: DispatchedEventTypes.tokenize,
        clientKey: clientKey,
        paymentMethodMetadata: paymentMethodMetadata,
        account: account
      }, '*');
    }
  }

  @Method()
  async tokenize(
    clientKey: string,
    paymentMethodMetadata: any,
    account?: string
  ): Promise<any> {
    return new Promise((resolve) => {
      const tokenizeEventListener = (event: MessageEvent) => {
        if (event.data.eventType !== DispatchedEventTypes.tokenize) return;
        window.removeEventListener('message', tokenizeEventListener);
        resolve(event.data.data);
      };
      window.addEventListener('message', tokenizeEventListener);
      this.triggerTokenization(clientKey, paymentMethodMetadata, account);
    });
  };

  render() {
    return (
      <Host>
        <iframe
          id="justifi-payment-method-form"
          height={this.height}
          src={this.iframeOrigin}
          ref={(el) => this.iframeElement = el as HTMLIFrameElement}>
        </iframe>
      </Host >
    );
  }
}
