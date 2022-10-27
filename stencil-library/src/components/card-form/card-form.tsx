import { Component, Event, Host, Prop, h, EventEmitter, Method } from '@stencil/core';

enum DispatchedEventTypes {
  blur = 'blur',
  change = 'change',
  ready = 'ready',
  tokenize = 'tokenize'
}

@Component({
  tag: 'justifi-card-form',
  styleUrl: 'card-form.css',
  shadow: true,
})
export class CardForm {
  @Prop() iframeOrigin: string;
  @Event() cardFormReady: EventEmitter;
  @Event() cardFormChange: EventEmitter;
  @Event() cardFormBlur: EventEmitter;
  @Event() cardFormTokenize: EventEmitter<{ data: any }>;
  iframeElement!: HTMLIFrameElement;

  connectedCallback() {
    window.addEventListener('message', this.dispatchMessageEvent.bind(this));
  }

  disconnectedCallback() {
    window.removeEventListener('message', this.dispatchMessageEvent.bind(this));
  }

  private dispatchMessageEvent(messageEvent: MessageEvent) {
    const messageType = messageEvent.data.eventType;
    switch (messageType) {
      case DispatchedEventTypes.ready:
        this.cardFormReady.emit();
        break;
      case DispatchedEventTypes.change:
        this.cardFormChange.emit();
        break;
      case DispatchedEventTypes.blur:
        this.cardFormBlur.emit();
        break;
      case DispatchedEventTypes.tokenize:
        this.cardFormTokenize.emit({ data: messageEvent.data.eventType });
        break;
      default:
        break;
    }
  }

  private triggerTokenization(clientKey: string, account: string, paymentMethodMetadata: any) {
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
    account: string,
    paymentMethodMetadata: any
  ) {
    return new Promise((resolve) => {
      const tokenizeEventListener = (event: MessageEvent) => {
        if (event.data.eventType !== DispatchedEventTypes.tokenize) return;
        window.removeEventListener('message', tokenizeEventListener);
        resolve(event.data.data);
      };
      window.addEventListener('message', tokenizeEventListener);
      this.triggerTokenization(clientKey, account, paymentMethodMetadata);
    });
  };

  render() {
    return (
      <Host>
        <iframe
          id="justifi-card-form"
          src={this.iframeOrigin || 'https://js.justifi.ai'}
          ref={(el) => this.iframeElement = el as HTMLIFrameElement}>
        </iframe>
      </Host >
    );
  }
}
