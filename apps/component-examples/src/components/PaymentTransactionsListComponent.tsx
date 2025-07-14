/// <reference path="../jsx.d.ts" />
import { h } from '../utils/simple-jsx';

export interface PaymentTransactionsListData {
  paymentId: string;
  webComponentToken: string;
}

export function PaymentTransactionsListComponent(data: PaymentTransactionsListData) {
  const { paymentId, webComponentToken } = data;

  return (
    <div class="two-column-layout">
      <div class="column-preview">
        <div class="list-component-wrapper">
          <justifi-payment-transactions-list
            payment-id={paymentId}
            auth-token={webComponentToken}
          ></justifi-payment-transactions-list>
        </div>
      </div>
      <div class="column-output" id="output-pane">
        <em>Payment transactions list output will appear here...</em>
      </div>
    </div>
  );
} 
