import { Component, Event, Prop, h, EventEmitter, Listen, Method } from '@stencil/core';

@Component({
  tag: 'justifi-bank-account-form',
  shadow: false,
})
export class BankAccountForm {
  @Prop() iframeOrigin: string;
  @Event() bankAccountFormReady: EventEmitter;
  @Event() bankAccountFormChange: EventEmitter;
  @Event() bankAccountFormBlur: EventEmitter;
  @Event() bankAccountFormTokenize: EventEmitter<{ data: any }>;

  @Listen('paymentMethodFormReady')
  readyHandler(event: CustomEvent) {
    this.bankAccountFormReady.emit(event);
  }

  @Listen('paymentMethodFormChange')
  changeHandler(event: CustomEvent) {
    this.bankAccountFormChange.emit(event);
  }

  @Listen('paymentMethodFormBlur')
  blurHandler(event: CustomEvent) {
    this.bankAccountFormBlur.emit(event);
  }

  @Listen('paymentMethodFormTokenize')
  tokenizeHandler(event: { data: any }) {
    this.bankAccountFormTokenize.emit(event);
  }

  // This should be typed to justifi-payment-method-form,
  // but couldn't figure it out without exposing an entire type for the component
  private childRef?: any;

  // This might not be the ideal approach, but it's the simplest approach I could find
  @Method()
  tokenize(...args: any) {
    if (!this.childRef) {
      throw new Error('Cannot call tokenize');
    }
    this.childRef.tokenize(...args);
  }

  render() {
    return (
      <justifi-payment-method-form
        ref={el => {
          if (el) { this.childRef = el }
        }}
        iframe-origin={this.iframeOrigin || 'https://js.justifi.ai/bank-account'}
        payment-method-form-ready={this.bankAccountFormReady}
        payment-method-form-change={this.bankAccountFormChange}
        payment-method-form-blur={this.bankAccountFormBlur}
        payment-method-form-tokenize={this.bankAccountFormTokenize}
      />
    );
  }
}
