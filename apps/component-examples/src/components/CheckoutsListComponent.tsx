/// <reference path="../jsx.d.ts" />
import { h } from '../utils/simple-jsx';

export interface CheckoutsListData {
  subAccountId: string;
  webComponentToken: string;
}

export function CheckoutsListComponent(data: CheckoutsListData) {
  const { subAccountId, webComponentToken } = data;

  return (
    <div class="two-column-layout">
      <div class="column-preview">
        <div class="list-component-wrapper">
          <justifi-checkouts-list
            account-id={subAccountId}
            auth-token={webComponentToken}
          ></justifi-checkouts-list>
        </div>
      </div>
      <div class="column-output" id="output-pane">
        <em>Checkouts list output will appear here...</em>
      </div>
    </div>
  );
} 
