import { Component, Prop, h, Host, State, Method, Event, EventEmitter } from '@stencil/core';
import { PaymentMethodTypes } from '../../api';
import { BillingFormFields } from '../billing-form/billing-form-schema';
import { CreatePaymentMethodResponse } from '../payment-method-form/payment-method-responses';
import { loadFontsOnParent } from '../../utils/utils';
import { config } from '../../../config';
import { ComponentError, ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import { getErrorMessage } from '../../api/services/utils';

@Component({
  tag: 'justifi-payment-form',
  styleUrl: 'payment-form.scss',
  shadow: true,
})
export class PaymentForm {
  @Prop() bankAccount?: boolean;
  @Prop() card?: boolean = true;
  @Prop() email?: string;
  @Prop() clientId?: string;
  @Prop() authToken?: string;
  @Prop() accountId?: string;
  @Prop() submitButtonText?: string;

  @State() submitButtonEnabled: boolean = true;
  @State() isLoading: boolean = false;
  @State() selectedPaymentMethodType: PaymentMethodTypes = PaymentMethodTypes.card;

  @Event() submitted: EventEmitter<CreatePaymentMethodResponse>;
  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;

  private paymentMethodFormRef?: HTMLJustifiPaymentMethodFormElement;
  private billingFormRef?: HTMLJustifiBillingFormElement;

  componentWillLoad() {
    if (!this.validateProps()) {
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        message: 'clientId or authToken is required',
        severity: ComponentErrorSeverity.ERROR
      });
      this.submitButtonEnabled = false;
    }
  }

  connectedCallback() {
    loadFontsOnParent();
  }

  @Method()
  async fillBillingForm(fields: BillingFormFields) {
    this.billingFormRef.fill(fields);
  }

  @Method()
  async enableSubmitButton() {
    this.submitButtonEnabled = true;
  }

  @Method()
  async disableSubmitButton() {
    this.submitButtonEnabled = false;
  }

  showPaymentMethodTypeSelector() {
    return this.card && this.bankAccount;
  }

  getSelectedPaymentMethodType() {
    if (this.showPaymentMethodTypeSelector()) {
      return this.selectedPaymentMethodType;
    } else if (this.card) {
      return PaymentMethodTypes.card;
    } else if (this.bankAccount) {
      return PaymentMethodTypes.bankAccount;
    } else {
      return PaymentMethodTypes.card;
    }
  }

  paymentMethodSelectedHandler(event: CustomEvent) {
    const paymentMethodType: PaymentMethodTypes = event.detail;
    this.selectedPaymentMethodType = paymentMethodType;
  }

  private validateProps(): boolean {
    return !!(this.clientId || this.authToken);
  }

  private getToken(): string {
    return this.authToken || this.clientId;
  }

  async submit(event) {
    event.preventDefault();
    if (!this.paymentMethodFormRef || !this.billingFormRef) return;

    const billingFormValidation = await this.billingFormRef.validate();
    const paymentMethodFormValidation = await this.paymentMethodFormRef.validate();

    if (!billingFormValidation.isValid || !paymentMethodFormValidation.isValid) return;

    this.isLoading = true;

    try {
      const billingFormFieldValues = await this.billingFormRef.getValues();
      const paymentMethodData = { email: this.email, ...billingFormFieldValues };
      const tokenizeResponse = await this.paymentMethodFormRef.tokenize(this.getToken(), paymentMethodData, this.accountId);
      if (tokenizeResponse.error) {
        this.errorEvent.emit({
          errorCode: ComponentErrorCodes.TOKENIZE_ERROR,
          message: tokenizeResponse.error.message,
          severity: ComponentErrorSeverity.ERROR
        });
      }
      this.submitted.emit(tokenizeResponse);
    } catch (error) {
      this.errorEvent.emit({
        errorCode: ComponentErrorCodes.UNKNOWN_ERROR,
        message: getErrorMessage(error),
        severity: ComponentErrorSeverity.ERROR
      })
    } finally {
      this.isLoading = false;
    }
  }

  render() {
    return (
      <Host>
        <form class="row gy-3">
          {this.showPaymentMethodTypeSelector() && (
            <div class="col-12">
              <justifi-payment-method-selector
                selectedPaymentMethodType={this.getSelectedPaymentMethodType()}
                onPaymentMethodSelected={event => this.paymentMethodSelectedHandler(event)}
              />
            </div>
          )}
          <div class="col-12">
            <justifi-payment-method-form
              payment-method-form-type={this.getSelectedPaymentMethodType()}
              iframeOrigin={config.iframeOrigin}
              ref={el => {
                if (el) {
                  this.paymentMethodFormRef = el;
                }
              }}
            />
          </div>
          <div class="col-12">
            <justifi-billing-form
              legend="Billing Info"
              ref={el => {
                if (el) {
                  this.billingFormRef = el;
                }
              }}
            />
          </div>
          <slot name='insurance' />
          <div class="col-12">
            <button
              data-testid="submit-button"
              type="submit"
              onClick={event => this.submit(event)}
              disabled={!this.submitButtonEnabled || this.isLoading}
              class={`btn btn-primary jfi-submit-button${this.isLoading ? ' jfi-submit-button-loading' : ''}`}
            >
              {
                this.isLoading ?
                  <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div> :
                  this.submitButtonText || 'Submit'
              }
            </button>
          </div>
        </form>
      </Host>
    );
  }
}
