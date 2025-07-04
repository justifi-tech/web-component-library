/// <reference path="../jsx.d.ts" />
import { h } from '../utils/simple-jsx';

export interface PaymentsListData {
  subAccountId: string;
  webComponentToken: string;
}

export function PaymentsListComponent(data: PaymentsListData) {
  const { subAccountId, webComponentToken } = data;

  return (
    <div class="two-column-layout">
      <div class="column-preview">
        <div class="list-component-wrapper">
          <justifi-payments-list
            account-id={subAccountId}
            auth-token={webComponentToken}
          ></justifi-payments-list>
        </div>
      </div>
      <div class="column-output" id="output-pane">
        <em>Payments list output will appear here...</em>
      </div>
    </div>
  );
} 
