import { Component, Event, h, EventEmitter, Listen, Method, Prop, State, } from '@stencil/core';
import { CreatePaymentMethodResponse } from '../payment-method-form/payment-method-responses';
import { Theme } from '../../utils/theme';
import { config } from '../../../config';
import JustifiAnalytics from '../../api/Analytics';

@Component({
  tag: 'justifi-bank-account-form',
  shadow: false,
})
export class BankAccountForm {

  /**
   * When to trigger validation of the form.
   */
  @Prop({ mutable: true }) validationMode: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';

  /**
   * URL for the rendered iFrame. End-users need not use this.
   */
  @Prop({ mutable: true }) iframeOrigin?: string = config.iframeOrigin;

  @State() internalStyleOverrides: Theme;

  /**
   * Triggered when iframe has loaded
   * @event justifi-bank-account-form#bankAccountFormReady
   */
  @Event() bankAccountFormReady: EventEmitter<any>;

  /**
   * Triggered when iframe has loaded
   * @event justifi-bank-account-form#ready
   */
  @Event() ready: EventEmitter<any>;

  /**
   * Triggered when the tokenize method is called on the component
   * @event justifi-bank-account-form#bankAccountFormTokenized
   */
  @Event({ eventName: 'bankAccountFormTokenize' }) bankAccountFormTokenized: EventEmitter<{ data: any }>;

  /**
   * Triggered when the validate method is called on the component
   * @event justifi-bank-account-form#bankAccountFormValidate
   */
  @Event({ eventName: 'bankAccountFormValidate' }) bankAccountFormValidated: EventEmitter<any>;

  @Listen('paymentMethodFormReady')
  readyHandler(event: CustomEvent) {
    console.warn(`The 'bankAccountFormReady' event is deprecated in the next major release and will be renamed to 'ready'`);
    this.bankAccountFormReady.emit(event);
    this.ready.emit(event);
  }

  @Listen('paymentMethodFormTokenized')
  tokenizeHandler(event: { data: any }) {
    console.warn(
      `The 'bankAccountFormTokenized' event is deprecated in the next major release. Please refer to the documentation for the migration process and alternative approach. This method will be removed in the future.`,
    );
    this.bankAccountFormTokenized.emit(event);
  }

  @Listen('paymentMethodFormValidated')
  validateHandler(event: { data: any }) {
    console.warn(
      `The 'bankAccountFormValidate' event is deprecated in the next major release. Please refer to the documentation for the migration process and alternative approach. This method will be removed in the future.`,
    );
    this.bankAccountFormValidated.emit(event);
  }

  private childRef?: HTMLJustifiPaymentMethodFormElement;

  analytics: JustifiAnalytics;

  componentWillLoad() {
    this.analytics = new JustifiAnalytics(this);
  }

  disconnectedCallback() {
    this.analytics.cleanup();
  }

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
  async validate() {
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
        payment-method-form-type="bankAccount"
        payment-method-form-ready={this.bankAccountFormReady}
        payment-method-form-validated={this.bankAccountFormValidated}
        payment-method-form-tokenize={this.bankAccountFormTokenized}
        payment-method-form-validation-mode={this.validationMode || 'onSubmit'}
      />
    );
  }
}
