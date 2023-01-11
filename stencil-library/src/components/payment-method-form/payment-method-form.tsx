import { Component, Event, Host, Prop, h, EventEmitter, Method } from '@stencil/core';
import { MessageEventType } from '../MessageEventTypes';

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

  private triggerTokenization(
    clientKey: string,
    paymentMethodMetadata: any,
    account?: string
  ) {
    if (this.iframeElement && this.iframeElement.contentWindow) {
      this.iframeElement.contentWindow.postMessage({
        eventType: MessageEventType[this.paymentMethodFormType].tokenize,
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
        if (event.data.eventType !== MessageEventType[this.paymentMethodFormType].tokenize) return;
        window.removeEventListener('message', tokenizeEventListener);
        resolve(event.data.data);
      };
      window.addEventListener('message', tokenizeEventListener);
      this.triggerTokenization(clientKey, paymentMethodMetadata, account);
    });
  };

  private getIframeSrc() {
    // let iframeSrc = `https://js.justifi.ai/v2/${this.paymentMethodFormType}`;
    let iframeSrc = `http://localhost:3003/v2/${this.paymentMethodFormType}`;
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
