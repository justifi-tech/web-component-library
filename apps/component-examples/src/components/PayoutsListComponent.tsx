/// <reference path="../jsx.d.ts" />
import { h } from '../utils/simple-jsx';

export interface PayoutsListData {
  subAccountId: string;
  webComponentToken: string;
}

export function PayoutsListComponent(data: PayoutsListData) {
  const { subAccountId, webComponentToken } = data;

  return (
    <div class="two-column-layout">
      <div class="column-preview">
        <div class="list-component-wrapper">
          <justifi-payouts-list
            account-id={subAccountId}
            auth-token={webComponentToken}
          ></justifi-payouts-list>
        </div>
      </div>
      <div class="column-output" id="output-pane">
        <em>Payouts list output will appear here...</em>
      </div>
    </div>
  );
}
