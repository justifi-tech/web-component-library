import { Component, Event, Host, Prop, h, EventEmitter, Method, State, Watch } from '@stencil/core';
import { MessageEventType } from './message-event-types';
import { Theme } from './theme';

@Component({
  tag: 'justifi-payment-method-form',
  styleUrl: 'payment-method-form.css',
  shadow: false,
})
export class PaymentMethodForm {
  @Prop() paymentMethodFormType: 'card' | 'bankAccount';
  @Prop() paymentMethodFormValidationStrategy: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
  @Prop() paymentMethodStyleOverrides: Theme;
  @Event({ bubbles: true }) paymentMethodFormReady: EventEmitter;
  @Event({ bubbles: true }) paymentMethodFormTokenize: EventEmitter<{ data: any }>;
  @State() height: number = 55;

  iframeElement!: HTMLIFrameElement;

  connectedCallback() {
    window.addEventListener('message', this.dispatchMessageEvent.bind(this));
  }

  disconnectedCallback() {
    window.removeEventListener('message', this.dispatchMessageEvent.bind(this));
  }

  componentShouldUpdate() {
    this.sendStyleOverrides();
  }

  @Watch('paymentMethodStyleOverrides')
  sendStyleOverrides() {
    if (this.paymentMethodStyleOverrides) {
      this.postMessage(
        MessageEventType[this.paymentMethodFormType].styleOverrides,
        { styleOverrides: this.paymentMethodStyleOverrides }
      );
    }
  }

  private dispatchMessageEvent(messageEvent: MessageEvent) {
    const messagePayload = messageEvent.data;
    const messageType = messagePayload.eventType;
    const messageData = messagePayload.data;

    if (messageType === MessageEventType[this.paymentMethodFormType].ready) {
      this.paymentMethodFormReady.emit(messageData);
    }

    if (messageType === MessageEventType[this.paymentMethodFormType].resize) {
      this.height = messageData.height;
    }
  }

  private postMessage(eventType: string, payload?: any) {
    if (this.iframeElement) {
      this.iframeElement.contentWindow.postMessage({ eventType: eventType, ...payload }, '*');
    }
  };

  private async postMessageWithResponseListener(eventType: string, payload?: any): Promise<any> {
    return new Promise((resolve) => {
      const responseListener = (event: MessageEvent) => {
        if (event.data.eventType !== eventType) return;
        window.removeEventListener('message', responseListener);
        resolve(event.data.data);
      };
      window.addEventListener('message', responseListener);
      this.postMessage(eventType, payload);
    });
  }

  @Method()
  async tokenize(clientKey: string, paymentMethodMetadata: any, account?: string): Promise<any> {
    const eventType = MessageEventType[this.paymentMethodFormType].tokenize;
    const payload = {
      clientKey: clientKey,
      paymentMethodMetadata: paymentMethodMetadata,
      account: account
    };

    return this.postMessageWithResponseListener(eventType, payload);
  };

  @Method()
  async validate(): Promise<any> {
    return this.postMessageWithResponseListener(MessageEventType[this.paymentMethodFormType].validate);
  };

  private getIframeSrc() {
    let iframeSrc = `https://js.justifi.ai/v2/${this.paymentMethodFormType}`;
    if (this.paymentMethodFormValidationStrategy) {
      iframeSrc += `?validationStrategy=${this.paymentMethodFormValidationStrategy}`
    }
    return iframeSrc;
  }

  render() {
    return (
      <Host>
        <iframe
          id={`justifi-payment-method-form-${this.paymentMethodFormType}`}
          src={this.getIframeSrc()}
          ref={(el) => this.iframeElement = el as HTMLIFrameElement}
          height={this.height}>
        </iframe>
      </Host >
    );
  }
}
