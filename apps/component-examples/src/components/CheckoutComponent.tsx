/// <reference path="../jsx.d.ts" />
import { h } from '../utils/simple-jsx';

export interface CheckoutData {
  checkoutId: string;
  webComponentToken: string;
  disableBankAccount: boolean;
  disableCreditCard: boolean;
  hideCardBillingForm: boolean;
  hideBankAccountBillingForm: boolean;
  billingFormFields: Record<string, any>;
}

export function CheckoutComponent(data: CheckoutData) {
  const {
    checkoutId,
    webComponentToken,
    disableBankAccount,
    disableCreditCard,
    hideCardBillingForm,
    hideBankAccountBillingForm
  } = data;

  return (
    <div class="two-column-layout">
      <div class="column-preview">
        <justifi-checkout
          auth-token={webComponentToken}
          checkout-id={checkoutId}
          disable-bank-account={disableBankAccount}
          disable-credit-card={disableCreditCard}
          hide-bank-account-billing-form={hideBankAccountBillingForm}
          hide-card-billing-form={hideCardBillingForm}
        ></justifi-checkout>
        <button id="fill-billing-form-button" hidden>Test Fill Billing Form</button>
        <button id="test-validate-button" hidden>Test Validate</button>
      </div>
      <div class="column-output" id="output-pane">
        <em>Checkout output will appear here...</em>
      </div>
    </div>
  );
} 
