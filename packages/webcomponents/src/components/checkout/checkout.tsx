import { Component, Prop, h, State, Watch, Event, EventEmitter, Method } from '@stencil/core';
import { makeGetCheckout, makeCheckoutComplete } from './checkout-actions';
import { CheckoutService } from '../../api/services/checkout.service';
import { ComponentError, ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import JustifiAnalytics from '../../api/Analytics';
import { BillingFormFields } from '../billing-form/billing-form-schema';

@Component({
  tag: 'justifi-checkout',
})
export class Checkout {
  @Prop() iframeOrigin?: string;
  @Prop() authToken: string;
  @Prop() checkoutId: string;
  @Prop() disableCreditCard?: boolean;
  @Prop() disableBankAccount?: boolean;
  @Prop() disableBnpl?: boolean;
  @Prop() disablePaymentMethodGroup?: boolean;

  @State() getCheckout: Function;
  @State() complete: Function;
  @State() errorMessage: string = '';

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentError>;

  private checkoutCoreRef?: HTMLJustifiCheckoutCoreElement;

  analytics: JustifiAnalytics;

  componentWillLoad() {
    this.analytics = new JustifiAnalytics(this);
    this.initializeGetCheckout();
  }

  disconnectedCallback() {
    this.analytics.cleanup();
  }

  private initializeGetCheckout() {
    if (this.authToken && this.checkoutId) {
      this.getCheckout = makeGetCheckout({
        authToken: this.authToken,
        checkoutId: this.checkoutId,
        service: new CheckoutService()
      });
      this.complete = makeCheckoutComplete({
        authToken: this.authToken,
        checkoutId: this.checkoutId,
        service: new CheckoutService()
      });
    } else {
      this.errorEvent.emit({
        message: 'auth-token and checkout-id are required',
        errorCode: ComponentErrorCodes.MISSING_PROPS,
        severity: ComponentErrorSeverity.ERROR,
      });
    }
  }

  @Watch('authToken')
  @Watch('checkoutId')
  propChanged() {
    this.initializeGetCheckout();
  }

  @Method()
  async fillBillingForm(fields: BillingFormFields) {
    this.checkoutCoreRef.fillBillingForm(fields);
  }

  render() {
    return (
      <justifi-checkout-core
        getCheckout={this.getCheckout}
        complete={this.complete}
        disableCreditCard={this.disableCreditCard}
        disableBankAccount={this.disableBankAccount}
        disableBnpl={this.disableBnpl}
        disablePaymentMethodGroup={this.disablePaymentMethodGroup}
        ref={el => {
          if (el) {
            this.checkoutCoreRef = el;
          }
        }}>
        <div slot="insurance">
          <slot name="insurance"></slot>
        </div>
      </justifi-checkout-core>
    );
  }
}
