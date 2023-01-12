import { Component, Event, Prop, h, EventEmitter, Method, Listen } from '@stencil/core';

@Component({
  tag: 'justifi-card-form',
  shadow: false,
})
export class CardForm {
  @Prop() validationStrategy: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
  @Event() cardFormReady: EventEmitter;
  @Event() cardFormTokenize: EventEmitter<{ data: any }>;
  @Event() cardFormValidate: EventEmitter<{ data: { isValid: boolean } }>;

  @Listen('paymentMethodFormReady')
  readyHandler(event: CustomEvent) {
    this.cardFormReady.emit(event);
  }

  @Listen('paymentMethodFormTokenize')
  tokenizeHandler(event: { data: any }) {
    this.cardFormTokenize.emit(event);
  }

  @Listen('paymentMethodFormValidate')
  validateHandler(event: { data: any }) {
    this.cardFormValidate.emit(event);
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
        payment-method-form-type="card"
        payment-method-form-ready={this.cardFormReady}
        payment-method-form-tokenize={this.cardFormTokenize}
        payment-method-form-validation-strategy={this.validationStrategy || 'onSubmit'}
      />
    );
  }
}
