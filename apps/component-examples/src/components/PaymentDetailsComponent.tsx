/// <reference path="../jsx.d.ts" />
import { h } from '../utils/simple-jsx';

export interface PaymentDetailsData {
  paymentId: string;
  webComponentToken: string;
}

export function PaymentDetailsComponent(data: PaymentDetailsData) {
  const { paymentId, webComponentToken } = data;

  return (
    <div class="two-column-layout">
      <div class="column-preview">
        <div class="list-component-wrapper">
          <justifi-payment-details
            auth-token={webComponentToken}
            payment-id={paymentId}
          ></justifi-payment-details>
        </div>
      </div>
      <div class="column-output" id="output-pane">
        <em>Payment details output will appear here...</em>
      </div>
    </div>
  );
} 
