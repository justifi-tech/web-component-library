/// <reference path="../jsx.d.ts" />
import { h } from '../utils/simple-jsx';

export interface PayoutTransactionsListData {
  payoutId: string;
  webComponentToken: string;
}

export function PayoutTransactionsListComponent(data: PayoutTransactionsListData) {
  const { payoutId, webComponentToken } = data;

  return (
    <div class="two-column-layout">
      <div class="column-preview">
        <div class="list-component-wrapper">
          <justifi-payout-transactions-list
            payout-id={payoutId}
            auth-token={webComponentToken}
          ></justifi-payout-transactions-list>
        </div>
      </div>
      <div class="column-output" id="output-pane">
        <em>Payout transactions list output will appear here...</em>
      </div>
    </div>
  );
} 
