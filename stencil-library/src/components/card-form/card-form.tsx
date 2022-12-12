import { Component, Event, Prop, h, EventEmitter } from '@stencil/core';

@Component({
  tag: 'justifi-card-form',
  shadow: false,
})
export class CardForm {
  @Prop() iframeOrigin: string;
  @Event() cardFormReady: EventEmitter;
  @Event() cardFormChange: EventEmitter;
  @Event() cardFormBlur: EventEmitter;
  @Event() cardFormTokenize: EventEmitter<{ data: any }>;

  render() {
    return (
      <justifi-payment-method-form
        iframe-origin={this.iframeOrigin || 'https://js.justifi.ai/card'}
        payment-method-form-ready={this.cardFormReady}
        payment-method-form-change={this.cardFormChange}
        payment-method-form-blur={this.cardFormBlur}
        payment-method-form-tokenize={this.cardFormTokenize}
      />
    );
  }
}
