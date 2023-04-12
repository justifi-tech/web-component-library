import { Component, Event, Prop, h, EventEmitter, Listen, Method, Watch, State } from '@stencil/core';
import { Theme } from '../payment-method-form/theme';

@Component({
  tag: 'justifi-bank-account-form',
  shadow: false,
})
export class BankAccountForm {
  @Prop() validationStrategy: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
  @Prop() styleOverrides?: string;
  @Prop() iframeOrigin?: string;
  @State() internalStyleOverrides: Theme;
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

  componentWillLoad() {
    this.parseStyleOverrides();
  }

  @Watch('styleOverrides')
  parseStyleOverrides() {
    if (this.styleOverrides) {
      const parsedStyleOverrides = JSON.parse(this.styleOverrides);
      this.internalStyleOverrides = parsedStyleOverrides;
    }
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
        paymentMethodStyleOverrides={this.internalStyleOverrides}
      />
    );
  }
}
