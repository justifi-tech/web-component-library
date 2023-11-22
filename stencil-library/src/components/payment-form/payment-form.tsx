import { Component, Prop, h, Host, State, Listen, Method, Event, EventEmitter } from '@stencil/core';
import { PaymentMethodTypes } from '../../api';
import { BillingFormFields } from '../billing-form/billing-form-schema';
import { CreatePaymentMethodResponse } from '../payment-method-form/payment-method-responses';
import { extractComputedFontsToLoad } from '../../utils/utils';

@Component({
  tag: 'justifi-payment-form',
  styleUrl: 'payment-form.scss',
  shadow: true,
})
export class PaymentForm {
  @Prop() bankAccount?: boolean;
  @Prop() card?: boolean;
  @Prop() email?: string;
  @Prop() iframeOrigin?: string;
  @Prop() clientId: string;
  @Prop() accountId?: string;
  @Prop() submitButtonText?: string;
  @Event() submitted: EventEmitter<CreatePaymentMethodResponse>;
  @State() submitButtonEnabled: boolean = true;
  @State() hasLoadedFonts: boolean = false;
  @State() isLoading: boolean = false;
  @State() selectedPaymentMethodType: PaymentMethodTypes;
  @State() allowedPaymentMethodTypes: PaymentMethodTypes[] = [];

  private paymentMethodFormRef?: HTMLJustifiPaymentMethodFormElement;
  private billingFormRef?: HTMLJustifiBillingFormElement;

  connectedCallback() {
    if (this.card) {
      this.allowedPaymentMethodTypes.push(PaymentMethodTypes.card);
    }
    if (this.bankAccount) {
      this.allowedPaymentMethodTypes.push(PaymentMethodTypes.bankAccount);
    }
    if (!this.allowedPaymentMethodTypes.length) {
      this.allowedPaymentMethodTypes.push(PaymentMethodTypes.card);
    }
    this.selectedPaymentMethodType = this.allowedPaymentMethodTypes[0];

    if (!this.hasLoadedFonts) {
      this.loadFontsOnParent();
      this.hasLoadedFonts = true;
    }
  }

  @Listen('paymentMethodSelected')
  paymentMethodSelectedHandler(event: CustomEvent) {
    const paymentMethodType: PaymentMethodTypes = event.detail;
    this.selectedPaymentMethodType = paymentMethodType;
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
  async loadFontsOnParent() {

    const parent = document.body;
    const fontsToLoad = extractComputedFontsToLoad();
    if (!parent || !fontsToLoad) {
      return null;
    }

    // This approach is needed to load the font in a parent of the component
    const fonts = document.createElement('link');
    fonts.rel = 'stylesheet';
    fonts.href = `https://fonts.googleapis.com/css2?family=${fontsToLoad}&display=swap`;

    parent.append(fonts);
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
      const paymentMethodData = {
        email: this.email,
        ...billingFormFieldValues,
      };
      const tokenizeResponse = await this.paymentMethodFormRef.tokenize(
        this.clientId,
        paymentMethodData,
        this.accountId,
      );

      // Check if tokenization is successful here and handle errors
      if (tokenizeResponse.error) {
        // Handle tokenization error
        const errorResponse: CreatePaymentMethodResponse = {
          id: '',
          type: 'payment_method',
          error: tokenizeResponse.error,
          page_info: 'Error encountered during tokenization', // Additional context
        };
        this.submitted.emit(errorResponse);
      } else {
        // Successful tokenization
        this.submitted.emit(tokenizeResponse);
      }
    } catch (error) {
      // Convert ServerError to CreatePaymentMethodResponse
      const errorResponse: CreatePaymentMethodResponse = {
        id: '',
        type: 'payment_method',
        error: error,
        page_info: 'Unexpected error during payment processing', // Additional context
      };
      this.submitted.emit(errorResponse);
    } finally {
      this.isLoading = false;
    }
  }

  render() {
    return (
      <Host>
        <form class="row gy-3">
          {this.allowedPaymentMethodTypes.length > 1 && (
            <div class="col-12">
              <justifi-payment-method-selector paymentMethodTypes={this.allowedPaymentMethodTypes} selectedPaymentMethodType={this.selectedPaymentMethodType} />
            </div>
          )}
          <div class="col-12">
            <justifi-payment-method-form
              payment-method-form-type={this.selectedPaymentMethodType}
              iframe-origin={this.iframeOrigin}
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
