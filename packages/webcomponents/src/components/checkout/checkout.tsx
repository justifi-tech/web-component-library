import { Component, Prop, h, State, Watch, Event, EventEmitter, Method } from '@stencil/core';
import { makeGetCheckout, makeCheckoutComplete } from './checkout-actions';
import { CheckoutService } from '../../api/services/checkout.service';
import { ComponentErrorCodes, ComponentErrorSeverity } from '../../api/ComponentError';
import JustifiAnalytics from '../../api/Analytics';
import { BillingFormFields, PostalFormFields } from '../billing-forms/billing-form-schema';
import { ILoadedEventResponse } from '../../api';
import { checkPkgVersion } from '../../utils/check-pkg-version';
import { ComponentErrorEvent } from '../../api/ComponentEvents';

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
  @Prop() hideCardBillingForm?: boolean;

  @State() getCheckout: Function;
  @State() complete: Function;
  @State() errorMessage: string = '';

  @Event({ eventName: 'error-event' }) errorEvent: EventEmitter<ComponentErrorEvent>;
  // The original event is emitted from the core component, 
  // but we want to expose it here so it's documented in the storybook
  @Event({ eventName: 'loaded' }) loadedEvent: EventEmitter<ILoadedEventResponse>;

  private checkoutCoreRef?: HTMLJustifiCheckoutCoreElement;

  analytics: JustifiAnalytics;

  componentWillLoad() {
    checkPkgVersion();
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
  async fillBillingForm(fields: BillingFormFields | PostalFormFields) {
    this.checkoutCoreRef.fillBillingForm(fields);
  }

  render() {
    return (
      <justifi-checkout-core
        getCheckout={this.getCheckout}
        authToken={this.authToken}
        complete={this.complete}
        disableCreditCard={this.disableCreditCard}
        disableBankAccount={this.disableBankAccount}
        disableBnpl={this.disableBnpl}
        disablePaymentMethodGroup={this.disablePaymentMethodGroup}
        hideCardBillingForm={this.hideCardBillingForm}
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
