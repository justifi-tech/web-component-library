import { Component, Prop, h, Host, State, Listen, Method, Event, EventEmitter } from '@stencil/core';
import { PaymentMethodTypes } from '../../api';
import { BillingFormFields } from '../billing-form/billing-form-schema';
import { CreatePaymentMethodResponse } from '../payment-method-form/payment-method-responses';
import { extractComputedFontsToLoad } from '../../utils/utils';
import { mockCheckout } from './test/mockCheckout';

@Component({
  tag: 'justifi-checkout',
  styleUrl: 'checkout.scss',
  shadow: true,
})
export class Checkout {
  @Prop() iframeOrigin?: string;
  @Prop() clientId: string;
  @Prop() accountId?: string;

  @Event() submitted: EventEmitter<CreatePaymentMethodResponse>;

  @State() hasLoadedFonts: boolean = false;
  @State() isLoading: boolean = false;
  @State() selectedPaymentMethodType: PaymentMethodTypes = PaymentMethodTypes.card;
  @State() checkout: any = {};
  @State() serverError: boolean = false;
  @State() errorMessage: string = '';

  private paymentMethodFormRef?: HTMLJustifiPaymentMethodFormElement;
  private billingFormRef?: HTMLJustifiBillingFormElement;

  connectedCallback() {
    this.fetchData();

    if (!this.hasLoadedFonts) {
      this.loadFontsOnParent();
      this.hasLoadedFonts = true;
    }
  }

  private fetchData() {
    this.isLoading = true;
    this.checkout = mockCheckout.data;
    this.isLoading = false;
  }

  // private async fetchData() {
  //   this.isLoading = true;
  //   try {
  //     const response: IApiResponse<any> = mockCheckout;
  //   } catch (error) {
  //     this.serverError = true;
  //     this.errorMessage = `Error fetching data: ${error.message}`;
  //   } finally {
  //     this.isLoading = false;
  //   }
  // }

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
      const paymentMethodData = { ...billingFormFieldValues };
      const tokenizeResponse = await this.paymentMethodFormRef.tokenize(this.clientId, paymentMethodData, this.accountId);
      if (tokenizeResponse.error) {
        console.error(`An error occured submitting the form: ${tokenizeResponse.error.message}`);
      }
      this.submitted.emit(tokenizeResponse);
    } catch (error) {
      console.error(`An error occured submitting the form: ${error}`);
    } finally {
      this.isLoading = false;
    }
  }

  render() {
    return (
      <Host>
        <form class="row gy-3">
          <div class="col-12">
            <justifi-payment-method-type-selector
              show-credit-card={this.checkout.payment_settings?.credit_card_payments}
              show-ach={this.checkout.payment_settings?.ach_payments}
              selected-payment-method-type={this.selectedPaymentMethodType}
            />
          </div>
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
              disabled={this.isLoading}
              class={`btn btn-primary jfi-submit-button${this.isLoading ? ' jfi-submit-button-loading' : ''}`}
            >
              {
                this.isLoading ?
                  <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div> :
                  'Submit'
              }
            </button>
          </div>
        </form>
      </Host>
    );
  }
}
