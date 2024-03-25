import { Component, h, Prop, State, Event, EventEmitter, Host, Listen, Method } from '@stencil/core';
import { CreatePaymentMethodResponse } from '../payment-method-form/payment-method-responses';
import { extractComputedFontsToLoad } from '../../utils/utils';
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
  @State() checkout: any = {};
  @State() serverError: boolean = false;
  @State() errorMessage: string = '';
  @State() creatingNewPaymentMethod: boolean = false;
  @State() selectedPaymentMethodToken: string;

  @Event() submitted: EventEmitter<CreatePaymentMethodResponse>;

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

  @Listen('toggleCreatingNewPaymentMethod')
  toggleCreatingNewPaymentMethodHandler() {
    this.creatingNewPaymentMethod = !this.creatingNewPaymentMethod;
  }

  @Listen('setSelectedPaymentMethodToken')
  setSelectedPaymentMethodToken(event: CustomEvent) {
    console.log('token', event.detail);
    this.selectedPaymentMethodToken = event.detail;
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
    this.isLoading = true;
    this.pay({
      paymentMethodToken: this.selectedPaymentMethodToken,
      onSuccess: ({ checkout }) => {
        this.checkout = checkout;
        this.selectedPaymentMethodToken = this.checkout.payment_methods[0].id;
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

  // Case 1: The checkout has a payment method group
  // Case 2: The checkout has a payment method group, but the user has opted to create a new payment method
  // Case 3: The checkout does not have a payment method group so the user must create a new payment method
  // Case 3: The checkout does not have a payment method group so the user must create a new payment method but doesn't want to save it
  render() {
    return (
      <Host>
        <div class="row gy-3">
          <div class="col-12 mb-4">
            {/* componentize this */}
            <h2 class="fs-5 fw-bold">Summary</h2>
            <div>Product desctiption</div>
            <div>Total $100.00</div>
          </div>
          <div class="col-12">
            <h2 class="fs-5 fw-bold border-bottom pb-3">Payment</h2>
            <h3 class="fs-6 fw-bold lh-lg">Select payment type</h3>
            <div class="d-flex flex-column">
              <justifi-payment-method-options
                show-card={this.checkout.payment_settings?.credit_card_payments || true}
                show-ach={this.checkout.payment_settings?.ach_payments || true}
                client-id={this.checkout.payment_client_id}
                account-id={this.checkout.account_id}
                savedPaymentMethods={this.checkout.payment_methods}
              />
            </div>
          </div>
          <div class="col-12">
            <div class="d-flex justify-content-end">
              <button
                type="submit"
                onClick={event => this.submit(event)}
                disabled={this.isLoading}
                class={`btn btn-primary jfi-submit-button ${this.isLoading ? 'jfi-submit-button-loading' : ''}`}
              >
                {this.isLoading ? this.loadingSpinner : 'Pay'}
              </button>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
