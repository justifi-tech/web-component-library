import { Component, Event, Prop, h, EventEmitter, Method, Listen } from '@stencil/core';

@Component({
  tag: 'justifi-card-form',
  styleUrl: 'card-form.css',
  shadow: false,
})
export class CardForm {
  @Prop() validationStrategy: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
  @Event() cardFormReady: EventEmitter;
  @Event() cardFormTokenize: EventEmitter<{ data: any }>;

  @Listen('paymentMethodFormReady')
  readyHandler(event: CustomEvent) {
    this.cardFormReady.emit(event);
  }

  @Listen('paymentMethodFormTokenize')
  tokenizeHandler(event: { data: any }) {
    this.cardFormTokenize.emit(event);
  }

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
        payment-method-form-type="card"
        payment-method-form-ready={this.cardFormReady}
        payment-method-form-tokenize={this.cardFormTokenize}
        payment-method-form-validation-strategy={this.validationStrategy || 'onSubmit'}
      />
    );
  }
}
