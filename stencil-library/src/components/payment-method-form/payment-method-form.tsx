import { Component, Event, Host, Prop, h, EventEmitter, Method } from '@stencil/core';
import { MessageEventType } from './message-event-types';

@Component({
  tag: 'justifi-payment-method-form',
  styleUrl: 'payment-method-form.css',
  shadow: false,
})
export class PaymentMethodForm {
  @Prop() paymentMethodFormType: 'card' | 'bankAccount';
  @Prop() paymentMethodFormValidationStrategy: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
  @Event({ bubbles: true }) paymentMethodFormReady: EventEmitter;
  @Event({ bubbles: true }) paymentMethodFormTokenize: EventEmitter<{ data: any }>;
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

    if (messageType === MessageEventType[this.paymentMethodFormType].ready) {
      this.paymentMethodFormReady.emit(messageData);
    }
  }

  private async postMessageWithResponseListener(eventType: string, payload?: any): Promise<any> {
    return new Promise((resolve) => {
      const responseListener = (event: MessageEvent) => {
        if (event.data.eventType !== eventType) return;
        window.removeEventListener('message', responseListener);
        resolve(event.data.data);
      };
      window.addEventListener('message', responseListener);

      this.iframeElement.contentWindow.postMessage({
        eventType: eventType,
        ...payload
      }, '*');
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
          ref={(el) => this.iframeElement = el as HTMLIFrameElement}>
        </iframe>
      </Host >
    );
  }
}
