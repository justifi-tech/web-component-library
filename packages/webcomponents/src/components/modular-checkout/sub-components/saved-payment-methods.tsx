import { Component, h } from "@stencil/core";
import { StyledHost } from '../../../ui-components';
import { checkoutStore } from '../../../store/checkout.store';
import { radioListItem } from '../../../styles/parts';
import { CardBrandLabels } from '../../checkout/payment-method-option-utils';
import { PAYMENT_METHODS, SavedPaymentMethod } from "../ModularCheckout";

@Component({
  tag: 'justifi-saved-payment-methods',
  shadow: true,
})
export class JustifiSavedPaymentMethods {
  componentWillLoad() {
    if (!checkoutStore.paymentMethods.length) {
      console.warn('No saved payment methods available.');
    }

    if (checkoutStore.disablePaymentMethodGroup) {
      console.warn('Payment method group is disabled.');
    }
  }

  onPaymentMethodOptionClick = (paymentMethod: SavedPaymentMethod) => (e: Event) => {
    e.preventDefault();
    checkoutStore.selectedPaymentMethod = { id: paymentMethod.id, type: paymentMethod.type }
    checkoutStore.paymentToken = paymentMethod.id;
  };

  isAllowedPaymentMethod = (paymentMethodType: PAYMENT_METHODS) => {
    const isCard = paymentMethodType === PAYMENT_METHODS.SAVED_CARD;
    const isBankAccount = paymentMethodType === PAYMENT_METHODS.SAVED_BANK_ACCOUNT;

    if (isCard && checkoutStore.disableCreditCard) {
      return false;
    }

    if (isBankAccount && checkoutStore.disableBankAccount) {
      return false;
    }

    return true;
  }

  render() {
    if (checkoutStore.disablePaymentMethodGroup) {
      return null;
    }

    return (
      <StyledHost>
        <div class="saved-payment-methods">
          {checkoutStore.paymentMethods.length ? checkoutStore.paymentMethods
            .filter((paymentMethod) => this.isAllowedPaymentMethod(paymentMethod.type))
            .map((paymentMethod) => (
              <div
                class="radio-list-item p-3"
                part={radioListItem}
                onClick={this.onPaymentMethodOptionClick(paymentMethod)}
              >
                <form-control-radio
                  name="paymentMethodType"
                  value={paymentMethod?.id}
                  checked={checkoutStore.paymentToken === paymentMethod?.id}
                  label={`${CardBrandLabels[paymentMethod?.brand] || ''} *${paymentMethod?.acct_last_four}`}
                />
              </div>
            )) : null}
        </div>
      </StyledHost>
    );
  }
}
