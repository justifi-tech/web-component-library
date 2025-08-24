import { Component, h } from "@stencil/core";
import { StyledHost } from '../../../ui-components';
import { checkoutStore } from '../../../store/checkout.store';
import { radioListItem } from '../../../styles/parts';
import { CardBrandLabels } from '../../checkout/payment-method-option-utils';
import { ICheckoutPaymentMethod } from '../../../api';
import { PAYMENT_METHOD_TYPES, PAYMENT_METHODS } from "../ModularCheckout";

@Component({
  tag: 'justifi-saved-payment-methods',
  shadow: true,
})
export class SavedPaymentMethods {
  componentWillLoad() {
    if (!checkoutStore.paymentMethods.length) {
      console.warn('No saved payment methods available.');
    }

    if (checkoutStore.disablePaymentMethodGroup) {
      console.warn('Payment method group is disabled.');
    }
  }

  onPaymentMethodOptionClick = (paymentMethod: ICheckoutPaymentMethod) => (e: Event) => {
    e.preventDefault();
    const SELECTED_PAYMENT_METHODS = {
      [PAYMENT_METHOD_TYPES.CARD]: PAYMENT_METHODS.SAVED_CARD,
      [PAYMENT_METHOD_TYPES.BANK_ACCOUNT]: PAYMENT_METHODS.SAVED_BANK_ACCOUNT,
    }

    checkoutStore.selectedPaymentMethod = SELECTED_PAYMENT_METHODS[paymentMethod.type];
    checkoutStore.paymentToken = paymentMethod.id;
  };

  isAllowedPaymentMethod = (paymentMethod: ICheckoutPaymentMethod) => {
    if (paymentMethod.type === PAYMENT_METHOD_TYPES.CARD && checkoutStore.disableCreditCard) {
      return false;
    }

    if (paymentMethod.type === PAYMENT_METHOD_TYPES.BANK_ACCOUNT && checkoutStore.disableBankAccount) {
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
            .filter(this.isAllowedPaymentMethod)
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
