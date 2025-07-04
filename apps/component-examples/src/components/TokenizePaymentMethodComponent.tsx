/// <reference path="../jsx.d.ts" />
import { h } from '../utils/simple-jsx';

export interface BillingFormFields {
  name: string;
  address_line1: string;
  address_line2: string;
  address_city: string;
  address_state: string;
  address_postal_code: string;
}

export interface TokenizePaymentMethodData {
  subAccountId: string;
  webComponentToken: string;
  disableBankAccount: boolean;
  disableCreditCard: boolean;
  hideCardBillingForm: boolean;
  hideBankAccountBillingForm: boolean;
  hideSubmitButton: boolean;
  billingFormFields: BillingFormFields;
}

export function TokenizePaymentMethodComponent(data: TokenizePaymentMethodData) {
  const {
    subAccountId,
    webComponentToken,
    disableBankAccount,
    disableCreditCard,
    hideCardBillingForm,
    hideBankAccountBillingForm,
    hideSubmitButton,
  } = data;

  return (
    <div class="two-column-layout">
      <div class="column-preview">
        <justifi-tokenize-payment-method
          auth-token={webComponentToken}
          account-id={subAccountId}
          disable-bank-account={disableBankAccount}
          disable-credit-card={disableCreditCard}
          hide-bank-account-billing-form={hideBankAccountBillingForm}
          hide-card-billing-form={hideCardBillingForm}
          hide-submit-button={hideSubmitButton}
        ></justifi-tokenize-payment-method>
        <button id="fill-billing-form-button" hidden>
          Test Fill Billing Form
        </button>
        <button id="test-validate-button" hidden>
          Test Validate
        </button>
        <button id="test-submit-button" hidden={!hideSubmitButton}>
          Test Submit
        </button>
      </div>
      <div class="column-output" id="output-pane">
        <em>Tokenization output will appear here...</em>
      </div>
    </div>
  );
} 
