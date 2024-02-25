import {
  Component,
  Event,
  Host,
  Prop,
  h,
  EventEmitter,
  Method,
} from '@stencil/core';
import iFrameResize from 'iframe-resizer/js/iframeResizer';
import { MessageEventType } from './message-event-types';
import { Theme } from './theme';
import packageJson from '../../../package.json';
import getComputedTheme from '../../utils/get-computed-theme';
import { CreatePaymentMethodResponse } from './payment-method-responses';
import { PaymentMethodTypes } from '../../api';
import { composeQueryParams } from '../../utils/utils';
import { FrameCommunicationService } from '../../utils/frame-comunication-service';

@Component({
  tag: 'justifi-payment-method-form',
  styleUrl: 'payment-method-form.css',
  shadow: false,
})
export class PaymentMethodForm {
  @Prop() paymentMethodFormType: PaymentMethodTypes.card | PaymentMethodTypes.bankAccount;
  @Prop({
    mutable: true,
  })
  paymentMethodFormValidationMode:
    | 'onChange'
    | 'onBlur'
    | 'onSubmit'
    | 'onTouched'
    | 'all';
  @Prop() iframeOrigin: string;
  @Prop() singleLine: boolean;

  @Event({ bubbles: true }) paymentMethodFormReady: EventEmitter<void>;
  @Event({ bubbles: true }) paymentMethodFormValidated: EventEmitter<any>;
  @Event({ bubbles: true }) paymentMethodFormTokenized: EventEmitter<CreatePaymentMethodResponse>;

  private computedTheme: Theme = getComputedTheme();
  private iframeElement!: HTMLIFrameElement;
  private frameService: FrameCommunicationService;

  disconnectedCallback() {
    this.frameService.removeMessageListener(this.dispatchMessageEvent);
  }

  @Method()
  async resize(): Promise<void> {
    this.postMessage(MessageEventType[this.paymentMethodFormType].resize);
  }

  @Method()
  async tokenize(
    clientId: string,
    paymentMethodMetadata: any,
    account?: string,
  ): Promise<CreatePaymentMethodResponse> {
    const eventType = MessageEventType[this.paymentMethodFormType].tokenize;
    return this.frameService.postMessageWithResponseListener(eventType, {
      clientId,
      paymentMethodMetadata,
      account,
      componentVersion: packageJson.version,
    });
  }

  @Method()
  async validate(): Promise<any> {
    const eventType = MessageEventType[this.paymentMethodFormType].validate;
    return this.frameService.postMessageWithResponseListener(eventType);
  }

  private sendStyleOverrides() {
    if (this.computedTheme) {
      this.postMessage(
        MessageEventType[this.paymentMethodFormType].styleOverrides,
        { styleOverrides: this.computedTheme }
      );
    }
  }

  private dispatchMessageEvent = (messageEvent: MessageEvent) => {
    const { eventType, data } = messageEvent.data;
    const eventTypeMessage = MessageEventType[this.paymentMethodFormType];

    if (eventType === eventTypeMessage.ready) {
      this.paymentMethodFormReady.emit(data);
    } else if (eventType === eventTypeMessage.tokenize) {
      this.paymentMethodFormTokenized.emit(data);
    } else if (eventType === eventTypeMessage.validate) {
      this.paymentMethodFormValidated.emit(data);
    }
  };

  private postMessage = (eventType: string, payload?: any) => {
    this.frameService.postMessage(eventType, payload);
  }

  private getIframeSrc() {
    let paramsList = [];
    if (this.paymentMethodFormValidationMode) {
      paramsList.push(`validationMode=${this.paymentMethodFormValidationMode}`);
    }
    if (this.singleLine) {
      paramsList.push(`singleLine=${this.singleLine}`);
    }

    let iframeSrc = `${this.iframeOrigin}/${this.paymentMethodFormType}${composeQueryParams(paramsList)}`;
    return iframeSrc;
  }

  private initializeFrameCommunicationService() {
    this.frameService = new FrameCommunicationService(this.iframeElement, this.iframeOrigin);
    this.frameService?.addMessageListener(this.dispatchMessageEvent);
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
            iFrameResize({
              scrollbars: false,
            }, this.iframeElement);
            this.initializeFrameCommunicationService();
            this.sendStyleOverrides();
          }}
        ></iframe>
      </Host>
    );
  }
}
