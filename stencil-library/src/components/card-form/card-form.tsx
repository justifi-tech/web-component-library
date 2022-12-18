import { Component, Event, Prop, h, EventEmitter, Method } from '@stencil/core';

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

  // This should be typed to justifi-payment-method-form,
  // but couldn't figure it out without exposing an entire type for the component
  private childRef?: any;

  // This might not be the ideal approach, but it's the simplest approach I could find
  @Method()
  async tokenize(...args: any) {
    if (!this.childRef) {
      throw new Error('Cannot call tokenize');
    }
    return this.childRef.tokenize(...args);
  }

  render() {
    return (
      <justifi-payment-method-form
        ref={el => (this.childRef = el)}
        iframe-origin={this.iframeOrigin || 'https://js.justifi.ai/card'}
        payment-method-form-ready={this.cardFormReady}
        payment-method-form-change={this.cardFormChange}
        payment-method-form-blur={this.cardFormBlur}
        payment-method-form-tokenize={this.cardFormTokenize}
      />
    );
  }
}
