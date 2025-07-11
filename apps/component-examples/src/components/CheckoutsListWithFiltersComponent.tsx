/// <reference path="../jsx.d.ts" />
import { h } from '../utils/simple-jsx';

export interface CheckoutsListWithFiltersData {
  subAccountId: string;
  webComponentToken: string;
}

export function CheckoutsListWithFiltersComponent(data: CheckoutsListWithFiltersData) {
  const { subAccountId, webComponentToken } = data;

  return (
    <div class="two-column-layout">
      <div class="column-preview">
        <div class="list-component-wrapper">
          <div>
            <justifi-checkouts-list-filters></justifi-checkouts-list-filters>
          </div>
          <div>
            <justifi-checkouts-list
              account-id={subAccountId}
              auth-token={webComponentToken}
            ></justifi-checkouts-list>
          </div>
        </div>
      </div>
      <div class="column-output" id="output-pane">
        <em>Checkouts list output will appear here...</em>
      </div>
    </div>
  );
} 
