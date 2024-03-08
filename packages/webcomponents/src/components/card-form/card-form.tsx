import { Component, Event, Prop, h, EventEmitter, Method, Listen, State } from '@stencil/core';
import { CreatePaymentMethodResponse } from '../payment-method-form/payment-method-responses';
import { Theme } from '../payment-method-form/theme';

@Component({
  tag: 'justifi-card-form',
  shadow: false,
})
export class CardForm {
  /**
   * When to trigger validation of the form.
   */
  @Prop({ mutable: true }) validationMode: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';

  /**
   * URL for the rendered iFrame. End-users need not use this.
   */
  @Prop({ mutable: true }) iframeOrigin?: string;

  /**
   * Boolean indicating if the Card Form should render in a single line
   */
  @Prop() singleLine: boolean = false;

  @State() internalStyleOverrides: Theme;

  /**
   * Triggered when iframe has loaded
   * @event justifi-card-form#cardFormReady
   */

  @Event() cardFormReady: EventEmitter;

  /**
   * Triggered when iframe has loaded
   * @event justifi-card-form#ready
   */

  @Event() ready: EventEmitter;

  /**
   * Triggered when the tokenize method is called on the component
   * @event justifi-card-form#cardFormTokenized
   */
  @Event({ eventName: 'cardFormTokenize' }) cardFormTokenized: EventEmitter<{ data: any }>;

  /**
   * Triggered when the validate method is called on the component
   * @event justifi-card-form#cardFormValidated
   */
  @Event({ eventName: 'cardFormValidate'}) cardFormValidated: EventEmitter<{ data: { isValid: boolean } }>;

  @Listen('paymentMethodFormReady')
  readyHandler(event: CustomEvent) {
    console.warn(`The 'cardFormReady' event is deprecated in the next major release and will be renamed to 'ready'`);
    this.cardFormReady.emit(event);
    this.ready.emit(event);
  }

  @Listen('paymentMethodFormTokenized')
  tokenizeHandler(event: { data: any }) {
    console.warn(
      `The 'cardFormTokenize' event is deprecated in the next major release. Please refer to the documentation for the migration process and alternative approach. This method will be removed in the future.`,
    );
    this.cardFormTokenized.emit(event);
  }

  @Listen('paymentMethodFormValidated')
  validateHandler(event: { data: any }) {
    console.warn(
      `The 'cardFormValidate' event is deprecated in the next major release. Please refer to the documentation for the migration process and alternative approach. This method will be removed in the future.`,
    );
    this.cardFormValidated.emit(event);
  }

  private childRef?: HTMLJustifiPaymentMethodFormElement;

  /**
   *  Makes a tokenization request to the iframe
   */
  @Method()
  async tokenize(...args: Parameters<HTMLJustifiPaymentMethodFormElement['tokenize']>): Promise<CreatePaymentMethodResponse> {
    if (!this.childRef) {
      throw new Error('Cannot call tokenize');
    }
    return this.childRef.tokenize(...args);
  }

  /**
   *  Runs a validation on the form and shows errors if any
   */
  @Method()
  async validate(): Promise<{ isValid: boolean }> {
    if (!this.childRef) {
      throw new Error('Cannot call validate');
    }
    return this.childRef.validate();
  }

  /**
   *  Manually resizes the iframe to fit the contents of the iframe
   *  @deprecated This method will be removed in future releases.
   */
  @Method()
  async resize(): Promise<void> {
    console.warn(
      `The 'resize' method is deprecated and will be removed in the next major release. Please refer to the documentation for the migration process and alternative approach.`,
    );
    if (!this.childRef) {
      throw new Error('Cannot call validate');
    }
    return this.childRef.resize();
  }

  render() {
    return (
      <justifi-payment-method-form
        ref={el => {
          if (el) {
            this.childRef = el;
          }
        }}
        iframe-origin={this.iframeOrigin}
        payment-method-form-type="card"
        single-line={this.singleLine}
        payment-method-form-ready={this.cardFormReady}
        payment-method-form-validate={this.cardFormValidated}
        payment-method-form-tokenize={this.cardFormTokenized}
        payment-method-form-validation-mode={this.validationMode || 'onSubmit'}
      />
    );
  }
}
