import { Component, Event, Prop, h, EventEmitter, Listen, Method } from '@stencil/core';

@Component({
  tag: 'justifi-bank-account-form',
  shadow: false,
})
export class BankAccountForm {
  @Prop({ mutable: true }) validationStrategy: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
  @Prop({ mutable: true }) iframeOrigin?: string;
  @Event() bankAccountFormReady: EventEmitter;
  @Event() bankAccountFormTokenize: EventEmitter<{ data: any }>;
  @Event() bankAccountFormValidate: EventEmitter<{ data: { isValid: boolean } }>;

  @Listen('paymentMethodFormReady')
  readyHandler(event: CustomEvent) {
    this.bankAccountFormReady.emit(event);
  }

  @Listen('paymentMethodFormTokenize')
  tokenizeHandler(event: { data: any }) {
    this.bankAccountFormTokenize.emit(event);
  }

  @Listen('paymentMethodFormValidate')
  validateHandler(event: { data: any }) {
    this.bankAccountFormValidate.emit(event);
  }

  private childRef?: HTMLJustifiPaymentMethodFormElement;

  @Method()
  async tokenize(...args: Parameters<HTMLJustifiPaymentMethodFormElement['tokenize']>) {
    if (!this.childRef) {
      throw new Error('Cannot call tokenize');
    }
    return this.childRef.tokenize(...args);
  }

  @Method()
  async validate() {
    if (!this.childRef) {
      throw new Error('Cannot call validate');
    }
    return this.childRef.validate();
  }

  render() {
    return (
      <justifi-payment-method-form
        ref={el => {
          if (el) { this.childRef = el }
        }}
        iframe-origin={this.iframeOrigin}
        payment-method-form-type="bankAccount"
        payment-method-form-ready={this.bankAccountFormReady}
        payment-method-form-tokenize={this.bankAccountFormTokenize}
        payment-method-form-validation-strategy={this.validationStrategy || 'onSubmit'}
      />
    );
  }
}
