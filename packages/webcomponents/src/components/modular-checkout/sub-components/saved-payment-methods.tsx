import { Component, h } from "@stencil/core";
import { StyledHost } from '../../../ui-components';
import { checkoutStore } from '../../../store/checkout.store';
import { radioListItem } from '../../../styles/parts';
import { CardBrandLabels } from '../../checkout/payment-method-option-utils';
import { ICheckoutPaymentMethod } from '../../../api';

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

  onPaymentMethodOptionClick = (paymentMethodId: string) => (e: Event) => {
    e.preventDefault();
    checkoutStore.selectedPaymentMethod = paymentMethodId;
  };

  isAllowedPaymentMethod = (paymentMethod: ICheckoutPaymentMethod) => {
    if (paymentMethod.type === 'card' && checkoutStore.disableCreditCard) {
      return false;
    }

    if (paymentMethod.type === 'bank_account' && checkoutStore.disableBankAccount) {
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
                onClick={this.onPaymentMethodOptionClick(paymentMethod?.id)}
              >
                <form-control-radio
                  name="paymentMethodType"
                  value={paymentMethod?.id}
                  checked={checkoutStore.selectedPaymentMethod === paymentMethod?.id}
                  label={`${CardBrandLabels[paymentMethod?.brand] || ''} *${paymentMethod?.acct_last_four}`}
                />
              </div>
            )) : null}
        </div>
      </StyledHost>
    );
  }
}
