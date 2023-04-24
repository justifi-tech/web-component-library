import { Component, Event, Prop, h, EventEmitter, Method, Listen, State, Watch } from '@stencil/core';
import { Theme } from '../payment-method-form/theme';

@Component({
  tag: 'justifi-card-form',
  shadow: false,
})
export class CardForm {
  @Prop({mutable: true}) validationMode: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
  @Prop({mutable: true}) styleOverrides?: string;
  @Prop({mutable: true}) iframeOrigin?: string;
  @Prop() singleLine: boolean;
  @State() internalStyleOverrides: Theme;
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
        payment-method-form-type="card"
        single-line={this.singleLine}
        payment-method-form-ready={this.cardFormReady}
        payment-method-form-tokenize={this.cardFormTokenize}
        payment-method-form-validation-mode={this.validationMode || 'onSubmit'}
        paymentMethodStyleOverrides={this.internalStyleOverrides}
      />
    );
  }
}
