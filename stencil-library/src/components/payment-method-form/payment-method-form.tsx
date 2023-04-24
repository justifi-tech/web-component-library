import { Component, Event, Host, Prop, h, EventEmitter, Method, State, Watch } from '@stencil/core';
import { MessageEventType } from './message-event-types';
import { Theme } from './theme';
import packageJson from '../../../package.json';

@Component({
  tag: 'justifi-payment-method-form',
  styleUrl: 'payment-method-form.scss',
  shadow: false,
})
export class PaymentMethodForm {
  @Prop({
    mutable: true,
  }) paymentMethodFormValidationStrategy: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
  @Prop() paymentMethodFormType: 'card' | 'bankAccount';
  @Prop() paymentMethodStyleOverrides: Theme | undefined;
  @Prop() iframeOrigin?: string;
  @Prop() singleLine: boolean;
  @Event({ bubbles: true }) paymentMethodFormReady: EventEmitter;
  @Event({ bubbles: true }) paymentMethodFormTokenize: EventEmitter<{ data: any }>;
  @State() height: number = 55;

  iframeElement!: HTMLIFrameElement;
  formLabel!: HTMLInputElement;
  formControl!: HTMLInputElement;
  formControlInvalid!: HTMLInputElement;

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
  async tokenize(clientId: string, paymentMethodMetadata: any, account?: string): Promise<any> {
    const eventType = MessageEventType[this.paymentMethodFormType].tokenize;
    const payload = {
      clientId: clientId,
      componentVersion: packageJson.version,
      paymentMethodMetadata: paymentMethodMetadata,
      account: account,
    };

    return this.postMessageWithResponseListener(eventType, payload);
  };

  @Method()
  async validate(): Promise<any> {
    return this.postMessageWithResponseListener(MessageEventType[this.paymentMethodFormType].validate);
  };

  private composeQueryParams(values: string[]) {
    const queryParams = values.map((value) => {
      if (value === values[0]) {
        return value = `?${value}`
      } else {
        return value = `&${value}`
      }
    })
    return queryParams.join('');
  }

  private getIframeSrc() {
    const productionIframeOrigin = 'https://js.justifi.ai/v2';
    const iframeOrigin = this.iframeOrigin || productionIframeOrigin;
    let iframeSrc = `${iframeOrigin}/${this.paymentMethodFormType}`;
    let paramsList = [];
    if (this.paymentMethodFormValidationStrategy) {
      paramsList.push(`validationMode=${this.paymentMethodFormValidationStrategy}`)
    }
    if(this.singleLine) {
      paramsList.push(`singleLine=${this.singleLine}`)
    }

    return iframeSrc.concat(this.composeQueryParams(paramsList));
  }

  render() {
    return (
      <Host exportparts="label,input">
        <div class="label"></div>
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
