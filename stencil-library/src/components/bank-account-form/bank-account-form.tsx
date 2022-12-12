import { Component, Event, Prop, h, EventEmitter } from '@stencil/core';

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

  render() {
    return (
      <justifi-payment-method-form
        iframe-origin={this.iframeOrigin || 'https://js.justifi.ai/bank-account'}
        payment-method-form-ready={this.bankAccountFormReady}
        payment-method-form-change={this.bankAccountFormChange}
        payment-method-form-blur={this.bankAccountFormBlur}
        payment-method-form-tokenize={this.bankAccountFormTokenize}
      />
    );
  }
}
