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
  @Prop({ mutable: true }) iframeOrigin?: string = config.iframeOrigin;
  @Prop() authToken: string;
  @Prop() getCheckout: Function;
  @Prop() pay: Function;
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
    const token = await this.tokenize();
    if (token) { await this.payWithPaymentMethodToken(token); }
    this.isLoading = false;
  }

  async tokenize() {
    try {
      const billingFormFieldValues = await this.billingFormRef.getValues();
      const paymentMethodData = { ...billingFormFieldValues };
      const clientId = this.checkout.payment_client_id;
      const tokenizeResponse = await this.paymentMethodFormRef.tokenize(clientId, paymentMethodData, this.checkout.account_id);

      this.submitted.emit(tokenizeResponse);

      if (tokenizeResponse.error) {
        console.error(`An error occured submitting the form: ${tokenizeResponse.error.message}`);
        return null;
      }

      const data = tokenizeResponse.data;
      const tokenizedPaymentMethod = (data as any).card || (data as any).ach; // fix the response types to avoid this
      return tokenizedPaymentMethod.token;
    } catch (error) {
      console.error(`An error occured submitting the form: ${error}`);
      return null;
    }
  }

  async payWithPaymentMethodToken(token: string) {
    console.log('payWithPaymentMethodToken', token)
    this.pay({
      paymentMethodToken: token,
      onSuccess: ({ checkout }) => {
        this.checkout = checkout;
        this.isLoading = false;
      },
      onError: (errorMessage) => {
        this.errorMessage = errorMessage;
        this.isLoading = false;
      },
    })
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
          <justifi-saved-payment-method-options />
          <justifi-new-payment-method-options
            show-card={this.checkout.payment_settings?.credit_card_payments || true}
            show-ach={this.checkout.payment_settings?.ach_payments || true}
          />
          <slot name='insurance' />
          <div class="col-12">
            <button
              type="submit"
              onClick={event => this.submit(event)}
              disabled={this.isLoading}
              class={`btn btn-primary jfi-submit-button ${this.isLoading ? 'jfi-submit-button-loading' : ''}`}
            >
              {this.isLoading ? this.loadingSpinner : 'Pay'}
            </button>
          </div>
        </form>
      </Host>
    );
  }
}