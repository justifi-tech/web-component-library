/// <reference path="../jsx.d.ts" />
import { h } from '../utils/simple-jsx';

export interface InsuranceData {
  primary_identity: {
    state: string;
    email: string;
    first_name: string;
    last_name: string;
    postal_code: string;
    country: string;
  };
  policy_attributes: {
    insurable_amount: number;
    start_date: string;
    end_date: string;
    covered_identity: {
      first_name: string;
      last_name: string;
    };
  };
}

export interface CheckoutWithInsuranceData {
  checkoutId: string;
  webComponentToken: string;
  insurance: InsuranceData;
}

export function CheckoutWithInsuranceComponent(data: CheckoutWithInsuranceData) {
  const { checkoutId, webComponentToken, insurance } = data;

  return (
    <div class="two-column-layout">
      <div class="column-preview">
        <justifi-checkout auth-token={webComponentToken} checkout-id={checkoutId}>
          <div slot="insurance">
            <justifi-season-interruption-insurance
              auth-token={webComponentToken}
              checkout-id={checkoutId}
              primary-identity-first-name={insurance.primary_identity.first_name}
              primary-identity-last-name={insurance.primary_identity.last_name}
              primary-identity-state={insurance.primary_identity.state}
              primary-identity-country={insurance.primary_identity.country}
              primary-identity-postal-code={insurance.primary_identity.postal_code}
              primary-identity-email-address={insurance.primary_identity.email}
              policy-attributes-insurable-amount={insurance.policy_attributes.insurable_amount}
              policy-attributes-start-date={insurance.policy_attributes.start_date}
              policy-attributes-end-date={insurance.policy_attributes.end_date}
              covered-identity-first-name={insurance.policy_attributes.covered_identity.first_name}
              covered-identity-last-name={insurance.policy_attributes.covered_identity.last_name}
            ></justifi-season-interruption-insurance>
          </div>
        </justifi-checkout>
      </div>
      <div class="column-output" id="output-pane">
        <em>Checkout output will appear here...</em>
      </div>
    </div>
  );
} 
