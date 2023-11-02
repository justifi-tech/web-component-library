import { Component, Event, Host, Prop, h, EventEmitter, Method } from '@stencil/core';
import iFrameResize from 'iframe-resizer/js/iframeResizer';
import { MessageEventType } from './message-event-types';
import { Theme } from './theme';
import packageJson from '../../../package.json';
import getComputedTheme from './get-computed-theme';
import { CreatePaymentMethodResponse } from './payment-method-responses';

@Component({
  tag: 'justifi-payment-method-form',
  styleUrl: 'payment-method-form.css',
  shadow: false,
})
export class PaymentMethodForm {
  @Prop() paymentMethodFormType: 'card' | 'bankAccount';
  @Prop({
    mutable: true,
  })
  paymentMethodFormValidationMode: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
  @Prop() iframeOrigin?: string;
  @Prop() singleLine: boolean;
  @Event({ bubbles: true }) paymentMethodFormReady: EventEmitter;
  @Event({ bubbles: true }) paymentMethodFormTokenize: EventEmitter<{ data: any }>;

  private computedTheme: Theme = getComputedTheme();

  iframeElement!: HTMLIFrameElement;

  connectedCallback() {
    window.addEventListener('message', this.dispatchMessageEvent.bind(this));
  }

  disconnectedCallback() {
    window.removeEventListener('message', this.dispatchMessageEvent.bind(this));
  }

  sendStyleOverrides() {
    if (this.computedTheme) {
      this.postMessage(MessageEventType[this.paymentMethodFormType].styleOverrides, { styleOverrides: this.computedTheme });
    }
  }

  private dispatchMessageEvent(messageEvent: MessageEvent) {
    const messagePayload = messageEvent.data;
    const messageType = messagePayload.eventType;
    const messageData = messagePayload.data;

    if (messageType === MessageEventType[this.paymentMethodFormType].ready) {
      this.paymentMethodFormReady.emit(messageData);
    }
  }

  private postMessage(eventType: string, payload?: any) {
    this.iframeElement?.contentWindow?.postMessage({ eventType: eventType, ...payload }, process.env.IFRAME_ORIGIN || '*');
  }

  @Method()
  async resize(): Promise<any> {
    this.postMessage(MessageEventType[this.paymentMethodFormType].resize);
  }

  private async postMessageWithResponseListener(eventType: string, payload?: any): Promise<any> {
    return new Promise(resolve => {
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
  async tokenize(clientId: string, paymentMethodMetadata: any, account?: string): Promise<CreatePaymentMethodResponse> {
    const eventType = MessageEventType[this.paymentMethodFormType].tokenize;
    const payload = {
      clientId: clientId,
      componentVersion: packageJson.version,
      paymentMethodMetadata: paymentMethodMetadata,
      account: account,
    };

    return this.postMessageWithResponseListener(eventType, payload);
  }

  @Method()
  async validate(): Promise<any> {
    return this.postMessageWithResponseListener(MessageEventType[this.paymentMethodFormType].validate);
  }

  private composeQueryParams(values: string[]) {
    const queryParams = values.map(value => {
      if (value === values[0]) {
        return (value = `?${value}`);
      } else {
        return (value = `&${value}`);
      }
    });
    return queryParams.join('');
  }

  private getIframeSrc() {
    const iframeOrigin = process.env.IFRAME_ORIGIN;
    let iframeSrc = `${iframeOrigin}/${this.paymentMethodFormType}`;
    let paramsList = [];
    if (this.paymentMethodFormValidationMode) {
      paramsList.push(`validationMode=${this.paymentMethodFormValidationMode}`);
    }
    if (this.singleLine) {
      paramsList.push(`singleLine=${this.singleLine}`);
    }

    return iframeSrc.concat(this.composeQueryParams(paramsList));
  }

  render() {
    return (
      <Host>
        <iframe
          id={`justifi-payment-method-form-${this.paymentMethodFormType}`}
          src={this.getIframeSrc()}
          ref={el => {
            this.iframeElement = el as HTMLIFrameElement;
          }}
          onLoad={() => {
            iFrameResize({ log: true }, this.iframeElement);
            this.sendStyleOverrides();
          }}
        ></iframe>
      </Host>
    );
  }
}
