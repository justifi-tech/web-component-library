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
    console.debug('[SavedPaymentMethods] componentWillLoad', {
      methodsCount: checkoutStore.paymentMethods.length,
      disablePaymentMethodGroup: checkoutStore.disablePaymentMethodGroup,
    });
  }

  onPaymentMethodOptionClick = (paymentMethodId: string) => (e: Event) => {
    e.preventDefault();
    console.debug('[SavedPaymentMethods] option clicked', { paymentMethodId });
    checkoutStore.selectedPaymentMethod = paymentMethodId;
  };

  isAllowedPaymentMethod = (paymentMethod: ICheckoutPaymentMethod) => {
    console.debug('[SavedPaymentMethods] checking allowed payment method', {
      id: paymentMethod?.id,
      type: paymentMethod?.type,
      disableCreditCard: checkoutStore.disableCreditCard,
      disableBankAccount: checkoutStore.disableBankAccount,
    });
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
      console.debug('[SavedPaymentMethods] render: payment method group disabled, returning null');
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
