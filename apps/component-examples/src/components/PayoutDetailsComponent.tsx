/// <reference path="../jsx.d.ts" />
import { h } from '../utils/simple-jsx';

export interface PayoutDetailsData {
  payoutId: string;
  webComponentToken: string;
}

export function PayoutDetailsComponent(data: PayoutDetailsData) {
  const { payoutId, webComponentToken } = data;

  return (
    <div class="two-column-layout">
      <div class="column-preview">
        <div class="list-component-wrapper">
          <justifi-payout-details
            auth-token={webComponentToken}
            payout-id={payoutId}
          ></justifi-payout-details>
        </div>
      </div>
      <div class="column-output" id="output-pane">
        <em>Payout details output will appear here...</em>
      </div>
    </div>
  );
} 
