import { Component, h, Prop, State, Event, EventEmitter, Host, Listen, Method } from '@stencil/core';
import { CreatePaymentMethodResponse } from '../payment-method-form/payment-method-responses';
import { extractComputedFontsToLoad } from '../../utils/utils';
import { PaymentMethodTypes } from '../../api';
import { config } from '../../../config';

@Component({
  tag: 'justifi-checkout-core',
  styleUrl: 'checkout-core.scss',
  shadow: true,
})
export class CheckoutCore {
  /**
 * URL for the rendered iFrame. End-users need not use this.
 */
  @Prop({ mutable: true }) iframeOrigin?: string = config.iframeOrigin; @Prop() authToken: string;
  @Prop() getCheckout: Function;
  @Prop() checkoutId: string;

  @State() hasLoadedFonts: boolean = false;
  @State() isLoading: boolean = false;
  @State() selectedPaymentMethodType: PaymentMethodTypes = PaymentMethodTypes.card;
  @State() checkout: any = {};
  @State() serverError: boolean = false;
  @State() errorMessage: string = '';

  @Event() submitted: EventEmitter<CreatePaymentMethodResponse>;

  private paymentMethodFormRef?: HTMLJustifiPaymentMethodFormElement;
  private billingFormRef?: HTMLJustifiBillingFormElement;

  componentWillLoad() {
    if (this.getCheckout) {
      this.fetchData();
    }
  }

  connectedCallback() {
    if (!this.hasLoadedFonts) {
      this.loadFontsOnParent();
      this.hasLoadedFonts = true;
    }
  }

  fetchData(): void {
    this.isLoading = true;

    this.getCheckout({
      onSuccess: ({ checkout }) => {
        this.checkout = checkout;
        this.isLoading = false;
      },
      onError: (errorMessage) => {
        this.errorMessage = errorMessage;
        this.isLoading = false;
      },
    });
  };

  @Listen('paymentMethodSelected')
  paymentMethodSelectedHandler(event: CustomEvent) {
    const paymentMethodType: PaymentMethodTypes = event.detail;
    this.selectedPaymentMethodType = paymentMethodType;
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
      const clientId = this.checkout.payment_client_id;
      const tokenizeResponse = await this.paymentMethodFormRef.tokenize(clientId, paymentMethodData);
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

  private loadingSpinner = (
    <div class="spinner-border spinner-border-sm" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  );

  render() {
    return (
      <Host>
        <form class="row gy-3">
          <justifi-payment-method-type-selector
            show-credit-card={this.checkout.payment_settings?.credit_card_payments}
            show-ach={this.checkout.payment_settings?.ach_payments}
            selected-payment-method-type={this.selectedPaymentMethodType}
          />
          <div class="col-12">
            <justifi-payment-method-form
              payment-method-form-type={this.selectedPaymentMethodType}
              iframe-origin={this.iframeOrigin}
              ref={el => {
                if (el) { this.paymentMethodFormRef = el; }
              }}
            />
          </div>
          <div class="col-12">
            <justifi-billing-form
              legend="Billing Info"
              ref={el => {
                if (el) { this.billingFormRef = el; }
              }}
            />
          </div>
          <slot name='insurance' />
          <div class="col-12">
            <button
              type="submit"
              onClick={event => this.submit(event)}
              disabled={this.isLoading}
              class={`btn btn-primary jfi-submit-button ${this.isLoading ? 'jfi-submit-button-loading' : ''}`}
            >
              {this.isLoading ? this.loadingSpinner : 'Submit'}
            </button>
          </div>
        </form>
      </Host>
    );
  }
}