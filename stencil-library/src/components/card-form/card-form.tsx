import { Component, Event, Prop, h, EventEmitter, Method } from '@stencil/core';


@Component({
  tag: 'justifi-card-form',
  styleUrl: 'card-form.css',
  shadow: false,
})
export class CardForm {
  @Prop() iframeOrigin: string;
  @Event() cardFormReady: EventEmitter;
  @Event() cardFormChange: EventEmitter;
  @Event() cardFormBlur: EventEmitter;
  @Event() cardFormTokenize: EventEmitter<{ data: any }>;

  private childRef?: HTMLJustifiPaymentMethodFormElement;

  @Method()
  async tokenize(...args: Parameters<HTMLJustifiPaymentMethodFormElement['tokenize']>) {
    if (!this.childRef) {
      throw new Error('Cannot call tokenize');
    }
    return this.childRef.tokenize(...args);
  }

  render() {
    return (
      <justifi-payment-method-form
        ref={el => {
          if (el) { this.childRef = el }
        }}
        iframe-origin={this.iframeOrigin || 'https://js.justifi.ai/card'}
        payment-method-form-ready={this.cardFormReady}
        payment-method-form-change={this.cardFormChange}
        payment-method-form-blur={this.cardFormBlur}
        payment-method-form-tokenize={this.cardFormTokenize}
      />
    );
  }
}
